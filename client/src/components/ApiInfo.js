import ApiText from "./ApiText"

const ApiInfo = ({ showAPI, setShowAPI}) => {
  return (
    <div>
      <h2>API Usage <button 
        onClick={() => setShowAPI(!showAPI)}
        className="button api-button">
          {showAPI? "Hide":"Show"}
        </button></h2>
      {showAPI && <ApiText />}
    </div>
  )
}

export default ApiInfo
