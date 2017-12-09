import React from 'react'
import Item from '../components/item'

let MusicList = React.createClass({
    render() {
        let list_ele = null;
        list_ele = this.props.music_list.map((item) => {
            return (
                <Item
                    key={item.id}
                    current_musicitem={item}
                    focus={item === this.props.current_musicitem}
                >
                    {item.title}
                </Item>
            )
        })
        return (
            <ul>
                {list_ele}
            </ul>
        )
    }
})
export default MusicList;