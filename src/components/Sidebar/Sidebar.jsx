import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import "./Sidebar.css";
import { Context } from "../../context/context";
const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [open, setOpen] = useState(false);

  const { callGemini, previousprompt, setrecentprompt, newchat } =
    useContext(Context);

  const loadprompt = async (prompt) => {
    setrecentprompt(prompt);
    await callGemini(prompt, true);
  };

  return (
    <div
      className={`sidebar${open ? " active" : ""}${
        extended ? " extended" : ""
      }`}
    >
      <div className="top">
        <img
          onClick={() => {
            setOpen(!open);
            setExtended(!extended);
          }}
          className="menu"
          src={assets.menu_icon}
          alt="Menu"
        />
        <div onClick={() => newchat()} className="new-chat">
          <img className="plus" src={assets.plus_icon} alt="Plus" />
          {extended ? <p>New chat</p> : null}
        </div>

        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {previousprompt.map((item, index) => {
              return (
                <div
                  onClick={() => loadprompt(item)}
                  key={index}
                  className="recent-entry"
                >
                  <img
                    className="message"
                    src={assets.message_icon}
                    alt="Message"
                  />
                  <p>{item.slice(0, 18)}....</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry ">
          <img className="setting" src={assets.setting_icon} alt="Setting" />
          {extended ? <p>Settings</p> : null}
        </div>
        <div className="bottom-item recent-entry ">
          <img className="question" src={assets.question_icon} alt="Question" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry ">
          <img className="history" src={assets.history_icon} alt="History" />
          {extended ? <p>Activity</p> : null}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
