import React from 'react'
import './item.less'
import PubSub from 'pubsub-js'

let Item = React.createClass({
    changeMusic: function (play) {
        PubSub.publish("PLAY_MUSIC", play)
    },
    deleteMusic: function (del, e) {
        e.stopPropagation();
        PubSub.publish("DELETE_MUSIC", del)
    },
    render() {
        let current_musicitem = this.props.current_musicitem;
        return (
            <li className={`components-listitem row ${this.props.focus ? 'focus' : ''}`}
                onClick={this.changeMusic.bind(this, current_musicitem)}>
                <p>{current_musicitem.title}------{current_musicitem.artist}</p>
                <button className="-col-auto delete"
                        onClick={this.deleteMusic.bind(this, current_musicitem)}>
                </button>
            </li>
        )
    }
})
export default Item;