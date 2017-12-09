import React from 'react'
import './progress.less'
//
//progress组件
//
let Progress = React.createClass({
    changeProgress(e) {
        let progressBar = this.refs.progressBar;
        let hand_progress = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.clientWidth;
        this.props.onChangeProgress && this.props.onChangeProgress(hand_progress);
    },
    render() {
        return (
            <div className="components-progress row"
                 ref="progressBar"
                 onClick={this.changeProgress}
            >
                {/*{this.props.progress}*/}
                <div className="progress"
                     style={{width: `${this.props.progress}%`}}
                >
                </div>
            </div>
        )
    }
});

export default Progress;
