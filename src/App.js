import React, { useRef, useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBK2Y6LP2joyoj74rR7Qfjn87li-YrVtXg",
  authDomain: "chatroom-app-3f006.firebaseapp.com",
  databaseURL: "https://chatroom-app-3f006.firebaseio.com",
  projectId: "chatroom-app-3f006",
  storageBucket: "chatroom-app-3f006.appspot.com",
  messagingSenderId: "460425415424",
  appId: "1:460425415424:web:37c8235da0368dfce241e5",
  measurementId: "G-6FQRQZMN8H",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <div className="header-items">
          <h1>Chatroom</h1>
          <SignOut />
        </div>
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(10000);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const SendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <div className="footer-container">
      <form className="message-subit-container" onSubmit={SendMessage}>
        <input className="message-input"
          placeholder="Aa.."
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button className="submit-btn" type="submit" disabled={!formValue}><i class="fas fa-paper-plane send-icon"></i></button>
      </form>
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img alt="" src={photoURL} />
      <div className="displayed-text-message-container">
      <h2 className="displayed-text-message">{text}</h2>
      </div>
    </div>
  );
}

function SignIn() {
  const SignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <>
    <button className="signin-btn" onClick={SignInWithGoogle}>
    <img alt="" class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
    Sign in with google</button>
    </>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button className="signout-btn" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;
