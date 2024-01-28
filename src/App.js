import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "BAnthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showFriend, SetShowFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState("");

  function handelShowFriend() {
    return SetShowFriend((showFriend) => !showFriend);
  }
  function handelAddFriend(newFriend) {
    if (!newFriend) return;
    return (
      setFriends((friends) => [...friends, newFriend]), SetShowFriend(false)
    );
  }
  function handelSelectedFriend(friend) {
    // return setSelectedFriend(friend);
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    SetShowFriend(false);
  }
  function handelSplit(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <List
          friends={friends}
          onSelect={handelSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showFriend && <AddFriend onAddFriends={handelAddFriend} />}
        <Button onClick={handelShowFriend}>
          {showFriend ? "close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <SplitBill selectedFriend={selectedFriend} onSplit={handelSplit} />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function List({ friends, onSelect }) {
  return (
    <div>
      {friends.map((person) => (
        <ListElements person={person} key={person.name} onSelect={onSelect} />
      ))}
    </div>
  );
}
function ListElements({ person, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === person.id;
  return (
    <div>
      <li className={isSelected ? "selected" : ""}>
        <img src={person.image} alt={person.name} />
        <h3>{person.name}</h3>
        <p className="red">
          {person.balance < 0 &&
            `You owe ${person.name} ${Math.abs(person.balance)}`}
        </p>
        <p className="green">
          {person.balance > 0 && `${person.name} owes you ${person.balance} `}
        </p>
        <p className="grey">{person.balance === 0 && "You are even"}</p>
        <Button onClick={() => onSelect(person)}>
          {isSelected ? "Close" : "Select"}
        </Button>
      </li>
    </div>
  );
}

function AddFriend({ onAddFriends }) {
  const [friendName, setFriend] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handelNewFriend(e) {
    e.preventDefault();
    if (!friendName || !image) return;
    const id = crypto.randomUUID();
    const name = friendName;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriends(newFriend);
    setFriend("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handelNewFriend}>
      <label>🫂Friend</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriend(e.target.value)}
      />

      <label>📷 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function SplitBill({ selectedFriend, onSplit }) {
  const [bill, setBill] = useState("");
  const [myExpenses, setMYExpenses] = useState("");
  const [whoPay, setWhoPay] = useState("user");
  const friendsExpenses = bill ? bill - myExpenses : "";
  const value = whoPay === "user" ? friendsExpenses : -myExpenses;
  function handelSubmit(e) {
    e.preventDefault();
    if (!bill || !myExpenses) return;
    onSplit(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🫤Your expenses</label>
      <input
        type="text"
        value={myExpenses}
        onChange={(e) =>
          setMYExpenses(
            Number(e.target.value) > bill ? myExpenses : Number(e.target.value)
          )
        }
      />

      <label>😅{selectedFriend.name}'s expenses</label>
      <input type="text" disabled value={friendsExpenses} />

      <label>🤭Who's paying the bill</label>
      <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
