import React from 'react'
import Header from './components/header'
import Player from './page/player.js'
import MusicList from './page/musiclist'
import {LIST} from './config/list'
import {Router, IndexRoute, Link, Route, hashHistory} from 'react-router'
import PubSub from 'pubsub-js'

//
//整体
//
let App = React.createClass({
    pchangeProgress(hand_progress) {
        $('#player').jPlayer('playHead', hand_progress * 100);
    },
    findMusic() {
        let index = this.state.music_list.indexOf(this.state.current_musicitem);
        return index;
    },
    playMusic(play) {
        $("#player").jPlayer('setMedia', {
            mp3: play.file,
        }).jPlayer("play");
        this.setState({
            current_musicitem: play,
        })
    },
    playNext() {
        let next = LIST[(this.findMusic() + 1) % this.state.music_list.length];
        this.setState({
            current_musicitem: next
        });
        this.playMusic(next);
    },
    playPre() {
        let pre = LIST[(this.findMusic() + 6) % this.state.music_list.length];
        this.setState({
            current_musicitem: pre
        });
        this.playMusic(pre);
    },
    playRadom(){
        let ran=LIST[2];
        this.setState({
            current_musicitem: ran
        });
        this.playMusic(ran);
    },
    changeRepeat() {
        let repeat = this.state.repeat_type;
        if (repeat === 'once'){
            this.setState({
                repeat_type: 'cycle'
            });
            $("#player").jPlayer("repeat");
        }
        if (repeat === 'cycle'){
            this.setState({
                repeat_type: 'random'
            });
        }
        if (repeat === 'random'){
            this.setState({
                repeat_type: 'once'
            });
        }
    },
    getInitialState() {
        return {
            music_list: LIST,
            current_musicitem: LIST[0],
            repeat_type: 'once'
        }
    },
    componentDidMount() {
        $("#player").jPlayer({
            supplied: 'mp3',
            wmode: 'window'
        });
        this.playMusic(this.state.current_musicitem);
        PubSub.subscribe("PLAY_MUSIC", (msg, play) => {
            this.playMusic(play)
        });
        PubSub.subscribe("PLAY_NEXT", (msg, item) => {
            this.playNext(item)
        });
        PubSub.subscribe("PLAY_PRE", (msg, item) => {
            this.playPre(item)
        });
        PubSub.subscribe("PLAY_RADOM", (msg, item) => {
            this.playRadom(item)
        });
        PubSub.subscribe("C_R", (msg,) => {
            this.changeRepeat();
        });
        PubSub.subscribe("DELETE_MUSIC", (msg, del) => {
            this.setState({
                music_list: this.state.music_list.filter(item => {
                    return (item !== del)
                })
            })
        })
    },
    componentWillUnmount() {
        PubSub.unsubscribe("PLAY_MUSIC");
        PubSub.unsubscribe("PLAY_NEXT");
        PubSub.unsubscribe("PLAY_PRE");
        PubSub.unsubscribe("C_R");
        PubSub.unsubscribe("DELETE_MUSIC");
        // $("#player").unbind($.jplayer.event.ended)
    },
    render() {
        return (
            <div>
                <Header/>
                {React.cloneElement(this.props.children, this.state)}
            </div>
        )
    }
})
let Root = React.createClass({
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Player}>

                    </IndexRoute>
                    <Route path="/list" component={MusicList}>

                    </Route>
                </Route>
            </Router>
        )

    }
});

export default Root;