import React, { useState, useEffect, useContext } from 'react'
import * as ABIS from './../../constants/ABIS.js'
import * as addresses from './../../constants/addresses.js'
import { SwitchToPolygon } from '../Network/SwitchNetwork.js'
import './../../style/admin.css'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react' // adjust the import path accordingly

import WalletContext from '../Wallet/WalletContext.js' // Adjust the import path accordingly

const Mint = () => {
  const [selectedCut, setSelectedCut] = useState(null)
  const [selectedClarity, setSelectedClarity] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedShape, setSelectedShape] = useState(null)
  const [selectedSymmetry, setSelectedSymmetry] = useState(null)
  const [selectedFluorescence, setSelectedFluorescence] = useState(null)
  const [selectedPolish, setSelectedPolish] = useState(null)
  const [selectedLab, setSelectedLab] = useState(null)
  const [certificateNumber, setCertificateNumber] = useState()
  const [caratWeight, setCaratWeight] = useState(null)
  const [next, setNext] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const { web3, connected, connectWallet, selectedAddress } = useContext(WalletContext)

  const cuts = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
  const clarities = [
    'Flawless',
    'Internally Flawless',
    'VVS1',
    'VVS2',
    'VS1',
    'VS2',
    'SI1',
    'SI2',
    'I1',
    'I2',
    'I3',
  ]
  const colors = [
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]
  const shapes = [
    'Round',
    'Princess',
    'Emerald',
    'Asscher',
    'Marquise',
    'Oval',
    'Radiant',
    'Pear',
    'Heart',
    'Cushion',
  ]
  const symmetries = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
  const fluorescences = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong']
  const polishes = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
  const labs = ['GIA', 'AGS', 'HRD', 'IGI', 'EGL', 'Other']

  const [jsonModalVisible, setJsonModalVisible] = useState(false)
  const [generatedJson, setGeneratedJson] = useState(null)

  const [tokenId, setTokenId] = useState(39) // Example token ID

  const generateJSON = () => {
    const jsonString = JSON.stringify(
      {
        name: `Vitale #${tokenId}`,
        description: 'Heritage Collection: Combining tradition with technology',
        image: `https://dnxt.app/images/${tokenId}.jpg`,
        animation_url: `https://dnxt.app/videos/${tokenId}.mp4`,
        edition: tokenId,
        attributes: [
          { trait_type: 'Cut', value: selectedCut },
          { trait_type: 'Clarity', value: selectedClarity },
          { trait_type: 'Color', value: selectedColor },
          { trait_type: 'Shape', value: selectedShape },
          { trait_type: 'Symmetry', value: selectedSymmetry },
          { trait_type: 'Fluorescence', value: selectedFluorescence },
          { trait_type: 'Polish', value: selectedPolish },
          { trait_type: 'Lab', value: selectedLab },
          { trait_type: 'Certificate Number', value: certificateNumber },
          { trait_type: 'Carat Weight', value: Number(caratWeight) },
        ],
      },
      null,
      2,
    )

    setGeneratedJson(jsonString)
    setJsonModalVisible(true)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Copied to clipboard successfully!')
      },
      function (err) {
        console.error('Unable to copy', err)
      },
    )
  }

  const handleCertificateChange = (event) => {
    setCertificateNumber(event.target.value)
  }

  const confirmMint = () => {
    fetchJson()

    const parameters = [
      selectedLab,
      certificateNumber,
      selectedShape,
      caratWeight,
      selectedColor,
      selectedClarity,
      selectedCut,
      selectedPolish,
      selectedSymmetry,
      selectedFluorescence,
    ]

    const allParametersSet = parameters.every((param) => param !== null && param !== undefined)

    if (!allParametersSet) {
      setErrorMessage('Missing parameters')
      return
    }

    // Proceed with minting
    mintWithInfo() // Uncommented line

    setErrorMessage(null) // clear any previous error message
  }

  const mintWithInfo = () => {
    if (!connected) {
      console.log('Not connected')
      return
    }

    mintToken()

    async function mintToken() {
      let dnft = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft)
      try {
        await dnft.methods
          .safeMintWithDiamondInfo(
            selectedAddress,
            selectedLab,
            certificateNumber,
            selectedShape,
            1,
            selectedColor,
            selectedClarity,
            selectedCut,
            selectedPolish,
            selectedSymmetry,
            selectedFluorescence,
          )
          .send({
            from: selectedAddress,
          })
          .on('receipt', function (receipt) {
            console.log(receipt)
          })

        // Close the modal after minting
        setShowModal(false)
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    if (connected) {
      const getNextTokenIdFromContract = async () => {
        const tokenContract = new web3.eth.Contract(ABIS.ABIDNFT, addresses.dnft)
        const current = await tokenContract.methods.totalSupply().call()
        const next = Number(current) + 1
        console.log(next + 'next')
        setNext(next)
        setTokenId(next)
      }
      getNextTokenIdFromContract()
    }
  }, [connected, web3])

  const handleCaratWeightChange = (e) => {
    let input = e.target.value

    // Use regular expression to match the desired format
    if (/^\d*(\.\d{0,2})?$/.test(input)) {
      // If in desired format, we update the state
      setCaratWeight(input)
    }
  }

  function fetchJson() {
    fetch('https://raw.githubusercontent.com/diamondnxt/diamondnxt/gh-pages/json/3.json')
      .then((response) => response.json())
      .then((data) => {
        console.log(data.attributes)
        // Do something with your data
      })
      .catch((error) => console.error('Error fetching the file:', error))
  }

  return connected ? (
    window.ethereum.chainId === '0x89' ? (
      <div className="mint-container">
        <h1 className="label">NFT Dashboard</h1>

        <div className="listbox-container">
          <label className="label">Next Token ID: {next}</label>
        </div>

        {/* Replaced Listboxes with CDropdowns */}
        <div className="dropdown-container">
          <label className="label">Cut:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">{selectedCut || 'Select a Cut'}</CDropdownToggle>
            <CDropdownMenu>
              {cuts.map((cut, cutIdx) => (
                <CDropdownItem key={cutIdx} onClick={() => setSelectedCut(cut)}>
                  {cut}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <div className="dropdown-container">
          <label className="label">Clarity:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">
              {selectedClarity || 'Select a Clarity'}
            </CDropdownToggle>
            <CDropdownMenu>
              {clarities.map((clarity, clarityIdx) => (
                <CDropdownItem key={clarityIdx} onClick={() => setSelectedClarity(clarity)}>
                  {clarity}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <div className="dropdown-container">
          <label className="label">Color:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">{selectedColor || 'Select a Color'}</CDropdownToggle>
            <CDropdownMenu>
              {colors.map((color, colorIdx) => (
                <CDropdownItem key={colorIdx} onClick={() => setSelectedColor(color)}>
                  {color}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <div className="certificate-container">
          <label className="label">Carat Weight:</label>
          <input name="caratWeight" onChange={handleCaratWeightChange} />
        </div>

        {/* Additional dropdowns for Shape, Polish, Symmetry, Fluorescence, and Lab */}
        {/* Shape Dropdown */}
        <div className="dropdown-container">
          <label className="label">Shape:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">{selectedShape || 'Select a Shape'}</CDropdownToggle>
            <CDropdownMenu>
              {shapes.map((shape, shapeIdx) => (
                <CDropdownItem key={shapeIdx} onClick={() => setSelectedShape(shape)}>
                  {shape}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        {/* Polish Dropdown */}
        <div className="dropdown-container">
          <label className="label">Polish:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">
              {selectedPolish || 'Select a Polish'}
            </CDropdownToggle>
            <CDropdownMenu>
              {polishes.map((polish, polishIdx) => (
                <CDropdownItem key={polishIdx} onClick={() => setSelectedPolish(polish)}>
                  {polish}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        {/* Symmetry Dropdown */}

        <div className="dropdown-container">
          <label className="label">Symmetry:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">
              {selectedSymmetry || 'Select a Symmetry'}
            </CDropdownToggle>
            <CDropdownMenu>
              {symmetries.map((symmetry, symmetryIdx) => (
                <CDropdownItem key={symmetryIdx} onClick={() => setSelectedSymmetry(symmetry)}>
                  {symmetry}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        {/* Fluorescence Dropdown */}
        <div className="dropdown-container">
          <label className="label">Fluorescence:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">
              {selectedFluorescence || 'Select a Fluorescence'}
            </CDropdownToggle>
            <CDropdownMenu>
              {fluorescences.map((fluorescence, fluorescenceIdx) => (
                <CDropdownItem
                  key={fluorescenceIdx}
                  onClick={() => setSelectedFluorescence(fluorescence)}
                >
                  {fluorescence}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        {/* Lab Dropdown */}
        <div className="dropdown-container">
          <label className="label">Lab:</label>
          <CDropdown variant="btn-group" direction="dropend">
            <CDropdownToggle color="secondary">{selectedLab || 'Select a Lab'}</CDropdownToggle>
            <CDropdownMenu>
              {labs.map((lab, labIdx) => (
                <CDropdownItem key={labIdx} onClick={() => setSelectedLab(lab)}>
                  {lab}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <div className="certificate-container">
          <label className="label">Certificate Number:</label>
          <input name="certificateNumber" onChange={handleCertificateChange} />
        </div>
        <br></br>
        <br></br>

        <button className="button" onClick={() => setShowModal(true)}>
          Mint
        </button>

        <br></br>
        {showModal && (
          <div className="modal">
            <div className="modal-overlay"></div>
            <div className="modal-content">
              <h2>Actions</h2>
              <p>
                ID: <span className="value">{tokenId}</span>
              </p>
              <p>
                Cut: <span className="value">{selectedCut}</span>
              </p>
              <p>
                Clarity: <span className="value">{selectedClarity}</span>
              </p>
              <p>
                Color: <span className="value">{selectedColor}</span>
              </p>
              <p>
                Shape: <span className="value">{selectedShape}</span>
              </p>
              <p>
                Symmetry: <span className="value">{selectedSymmetry}</span>
              </p>
              <p>
                Fluorescence: <span className="value">{selectedFluorescence}</span>
              </p>
              <p>
                Polish: <span className="value">{selectedPolish}</span>
              </p>
              <p>
                Lab: <span className="value">{selectedLab}</span>
              </p>
              <p>
                Certificate Number: <span className="value">{certificateNumber}</span>
              </p>
              <p>
                Carat Weight: <span className="value">{caratWeight}</span>
              </p>
              {errorMessage && <label className="missingParameters">{errorMessage}</label>}
              <button className="button" onClick={() => confirmMint()}>
                Mint
              </button>
              <button className="button" onClick={() => generateJSON()}>
                Generate JSON
              </button>
              {jsonModalVisible && (
                <div className="modal">
                  <div className="modal-overlay" onClick={() => setJsonModalVisible(false)}></div>
                  <div className="modal-content">
                    <h2>Generated JSON</h2>
                    <textarea value={generatedJson} readOnly rows={10} cols={60} />
                    <button
                      className="button"
                      onClick={() => {
                        copyToClipboard(generatedJson)
                      }}
                    >
                      Copy JSON
                    </button>
                  </div>
                </div>
              )}
              <button className="button" onClick={() => confirmMint()}>
                Estimate Price
              </button>
              <button className="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    ) : (
      <>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <SwitchToPolygon connectWallet={connectWallet} connected={connected} />
      </>
    )
  ) : (
    <>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <button className="button" onClick={() => connectWallet()}>
        Connect
      </button>
    </>
  )
}

export default Mint
