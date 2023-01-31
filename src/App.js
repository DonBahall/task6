import './App.css'
import React from "react";
import Button from '@material-ui/core/Button';
import {List, ListItem, ListItemText, TextField} from "@material-ui/core";

const history = [];

function App() {

    const [input, setInput] = React.useState("");
    const nums = Array();
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, "."].forEach((item) => {
        nums.push(
            <Button
                onClick={(e) => {
                    setInput(input + e.currentTarget.value);
                }}
                value={item}
                key={item}
            >
                {" "}
                {item}
            </Button>
        );
    });
    return (

        <div className="wrapper">
            {" "}
            <div className="screen">{input}</div>
            <div className="button">{nums}</div>
            <div className="subgrid">

                <Button onClick={() => setInput(input.substr(0, input.length - 1))}>
                    Clear
                </Button>
                <Button onClick={() => setInput("")} value="">
                    AC
                </Button>
            </div>

            <div className="subgrid">

                <Button onClick={(e) => setInput(input + e.currentTarget.value)} value={"+"}>
                    +
                </Button>

                <Button onClick={(e) => setInput(input + e.currentTarget.value)} value="-">
                    {" "}
                    -
                    {" "}
                </Button>

                <Button onClick={(e) => setInput(input + e.currentTarget.value)} value="*">
                    {" "}
                    *
                </Button>

                <Button onClick={(e) => setInput(input + e.currentTarget.value)} value="/">
                    {" "}
                    /
                </Button>

                <Button
                    onClick={(e) => {
                        try {
                            let ans = String(eval(input));
                            setInput(
                                ans.includes(".") ?
                                    ans.toFixed(4) : calc(input));
                            historyPush(input + "=" + eval(input));
                        } catch (e) {
                            console.log(e);
                        }
                    }}
                    value="="
                >
                    =
                </Button>
            </div>

            <div className={"history"}>
                <Button onClick={(e) => sendToBack()}>Get and solve</Button>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {history.map((value) => (
                <ListItem
                    key={value}
                    disableGutters
                    > <ListItemText primary={`${value}`} /></ListItem>
                    ))}
                </List>
            </div>
        </div>

    );

}

async function sendToBack() {
    return await fetch('http://localhost:8080/math/examples?count=5', {
        method: 'GET',
        mode: 'cors',
        headers: {'Access-Control-Allow-Origin': '*'}
    }).then((response) => response.json())
        .then((json) => {
            for (let i = 0; i < json.length; i++) {
                historyPush(json[i] + "=" + calc(json[i]))
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function calc(input) {
    let value = input.match((/(^[0-9*\/\\()+-]+$)/));
    let res = new Function('return ' + value);
    return res();
}

function historyPush(input) {
    history.push(input);
}

export default App;
