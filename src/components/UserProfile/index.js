import React, {useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import "./styles.scss";
import userIMG from "./../../assets/user.png";

const UserProfile = (props) => {
  const { currentUser } = props;
  const { userName } = currentUser;
  const [time, setTime] = useState(0)
  var today = new Date()
  var curHr = today.getHours()

  useEffect(() => {
    if (curHr < 12) {
      setTime(0);
    } else if (curHr < 18) {
      setTime(1);
    } else {
      setTime(2);
    }
  }, [curHr])

  return (
    <div className="userProfile">
      <ul>
        <li>
          <div className="img">
            <img src={userIMG} />
          </div>
        </li>
        <li>
          {time == 0 && (
            <span className="displayName1">Good Morning,</span>
          )}
          {time == 1 && (
            <span className="displayName1">Good Afternoon,</span>
          )}
          {time == 2 && (
            <span className="displayName1">Good Evening,</span>
          )}
          <span className="displayName"> {userName && userName}</span>
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;
