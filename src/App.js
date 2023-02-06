import React from "react";
import Button from "@material-ui/core/Button";
import {List, ListItem, ListItemText} from "@material-ui/core";
import './App.css'

let history = [];

class App extends React.Component {

    tape(value) {
        let curVal = value;
        let output = this.refOut.current
        this.setState({
            out: curVal
        })
        if (output.value === '0') {
            output.value = ''
        }
        output.value += curVal;
    }
    tapeOper(value){
        let curVal = value;
        let output = this.refOut.current
        let op = ['+','-','*','/'];
        this.setState({
            out: curVal
        })
        let lastElement = output.value.substring(output.value.length - 1);
        for (let i = 0; i < op.length;i++)
            if (lastElement === op[i]) {
                output.value = output.value.substring(0, output.value.length - 1)
            }

        output.value += curVal;
    }

    calc(input) {
        let value = input.match((/(^[0-9*\/\\()+-]+$)/));
        let res = new Function('return ' + value);
        return res();
    }

    operationsWork(value) {
        let output = this.refOut.current
        if (value === 'AC') {
            output.value = output.value.substring(0, output.value.length - 1)
        } else if (value === 'Cl') {
            output.value = ''
        } else if (value === '=') {
            try {
                history.push(output.value + '=' + calc(output.value))
                output.value = calc(output.value)
            }catch (e){
                console.log(e)
            }
        }
    }

    oper() {
        const oper = [];
        ['+', '-', '*', '/'].forEach((i) => {
            oper.push(
                <Button onClick={(e) => this.tapeOper(i)}
                        value={i}
                        key={i}>
                    {i}
                </Button>
            )
        });
        return oper;
    }

    numbers() {
        const nums = [];
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0].forEach((item) => {
            nums.push(
                <Button onClick={(e) => this.tape(item)}
                        value={item}
                        key={item}
                >
                    {" "}
                    {item}
                </Button>
            );
        });
        return nums;
    }

    constructor() {
        super();
        this.state = {
            out: "0"
        }
        this.refOut = React.createRef();
    }

    render() {
        return (
            <div className="wrapper">
                {" "}
                <div className={"screen"}>
                    <input ref={this.refOut} type={"text"} defaultValue={this.state.out}/>
                </div>
                <div className="button">{this.numbers()}</div>
                <div className="subgrid">
                    <Button onClick={() => this.operationsWork('AC')}>
                        AC
                    </Button>
                    <Button onClick={() => this.operationsWork('Cl')}>
                        Clear
                    </Button>
                </div>
                <div className="subgrid">
                    {this.oper()}
                    <Button onClick={() => this.operationsWork('=') }>
                        =
                    </Button>
                </div>

                <div className={"history"}>
                    <Button onClick={(e) => sendToBack(history)}>Get and solve</Button>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        { history.map((value, index) => (
                            <ListItem
                                key={value}
                                disableGutters
                            >
                                <ListItemText className={`${index === 0 ? "active" : ""}`} primary={`${value}`} />

                            </ListItem>
                        ))}
                    </List>

                </div>
            </div>
        )
    }
}
function calc(input) {
    let value = input.match((/(^[0-9*\/\\()+-]+$)/));
    let res = new Function('return ' + value);
    return res();
}

async function sendToBack(history) {
    return await fetch('http://localhost:8080/math/examples?count=5', {
        method: 'GET',
        mode: 'cors',
        headers: {'Access-Control-Allow-Origin': '*'}
    }).then((response) => response.json())
        .then((json) => {
            for (let i = 0; i < json.length; i++) {
                history.push(json[i] + "=" + calc(json[i]))
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


export default App