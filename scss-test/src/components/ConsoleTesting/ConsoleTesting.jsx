import React, { Component } from 'react';


class ConsoleTesting extends Component{

    printTimingExample(){
        // Synchronous
        console.log("%cTimingExampleSync", "font-size: 20px; border-bottom: 1px solid red");
        console.log("#1 -> First! SYNC");
        console.log("#1 -> SECOND SYNC");
        // console.groupEnd("TimingExampleSync");

        // console.groupCollapsed("TimingExampleTimeout");
        console.log("%cTimingExampleTimeout", "font-size: 20px; border-bottom: 1px solid red");
        setTimeout(() => console.log('#2 -> First! Timeout'), 0);
        console.log('#2 -> SECOND sync');
        // console.groupEnd("TimingExampleTimeout");

        // console.groupCollapsed("TimingExamplePromise");
        console.log("%cTimingExamplePromise", "font-size: 20px; border-bottom: 1px solid red");
        setTimeout(() => console.log('#3 -> First! Timeout'), 0);
        Promise.resolve().then(v => console.log('#3 -> inbetween Promise'));
        console.log('#3 -> SECOND sync');
        // console.groupEnd("TimingExamplePromise");
    }

    render(){
        return(
            <div>
              <h1>Console Testing</h1>
              <button onClick={this.printTimingExample} >TimingExample</button>
            </div>
        );
    }
}

export default ConsoleTesting;
