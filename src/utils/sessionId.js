import {v4 as Uuidv4} from "uuid";

export const SessionId = () => {

    let id = localStorage.getItem("sessionId");

    if (!id) {

        id = Uuidv4();

        localStorage.setItem("sessionId", id);

    }

    return id;

};