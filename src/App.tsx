import {toast, Toaster} from "react-hot-toast";
import updater from "./updater";
import useWeb3 from "./hooks/useWeb3";
import {useConnection} from "./states/connection";
import useGreetingContract from "./hooks/useGreetingContract";
import {useState} from "react";

function App() {
  //example to use useWeb3() hook
  const {isActive, activate, deActivate} = useWeb3()
  const {connection} = useConnection()
  const {greet, setGreet} = useGreetingContract()
  const [greeting, setGreeting] = useState("")
  const [greetingMessage, setGreetingMessage] = useState("")
  const [loading, setLoading] = useState(false);

  let handleGreet = async () => {
    try {
      const greeting = await greet()
      setGreeting(greeting)
      toast.success("Greeted successfully with " + greeting)
    } catch (err: any) {
      console.log(err)
      toast.error("Error getting greeting ".concat(err.message))
    }
  };
  let handleSetGreet = async () => {
    if (!greetingMessage) {
      toast.error("Greeting message is empty")
      return
    }
    const setGreetPromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        await setGreet(greetingMessage)
        resolve(null)
      } catch (err) {
        console.log(err)
        reject(err)
      } finally {
        setLoading(false)
      }
    })

    await toast.promise(setGreetPromise, {
      loading: "Setting greeting",
      success: "Greeting set successfully",
      error: err => "Error setting greeting: ".concat(err.message),
    })
  };
  return (
    <div>
      <h3>A Template to connect multi blockchains wallets check current network, save connection state to redux,..</h3>
      <div>
        <button onClick={isActive ? deActivate : activate}>
          {isActive ? 'Log out wallet' : 'Connect wallet'}
        </button>
      </div>
      <div>
        wallet address: {connection.address}
      </div>
      <div>
        <div>
          <input type="text" placeholder='Set greet' value={greetingMessage} onChange={e => {
            setGreetingMessage(e.target.value)
          }}/>
          <button onClick={handleSetGreet} disabled={loading}>
            {loading ? 'Setting...' : 'Set greet'}
          </button>
        </div>
        <div>
          <button onClick={handleGreet}>Greet</button>
          <div>{greeting}</div>
        </div>
      </div>
      <Toaster/>
    </div>
  )
}

export default updater(App)
