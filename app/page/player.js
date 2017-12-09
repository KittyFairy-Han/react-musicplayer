import React from 'react'
import Progress from '../components/progress'
import './player.less'
import {Link} from 'react-router'
import {LIST} from '../config/list'
//
//progress组件
//
let Player = React.createClass({
    pchangeProgress(hand_progress) {
        $('#player').jPlayer('playHead', hand_progress * 100);
    },
    pchangeVolume(hand_volume) {
        $('#player').jPlayer('volume', hand_volume);
    },
    formatTime(time) {
        time = Math.floor(time);
        let miniute = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);

        return miniute + ':' + (seconds < 10 ? '0' + seconds : seconds);
    },
    playmusic() {
        if (this.state.is_play) {
            $('#player').jPlayer('pause');
        } else {
            $('#player').jPlayer('play');
        }
        this.setState({
            is_play: !this.state.is_play
        })
    },
    playNext: function (item) {
        PubSub.publish("PLAY_NEXT", item)
    },
    playPre: function (item) {
        PubSub.publish("PLAY_PRE", item)
    },
    playRadom:function (item) {
        PubSub.publish("PLAY_RANDOM", item)
    },
    changeRepeat: function (item) {
        PubSub.publish("C_R",item)
    },
    getInitialState() {
        return {
            progress: 0,
            volume: 0,
            is_play: true,
            left: '',
        }
    },
    componentDidMount() {
        $("#player").bind($.jPlayer.event.timeupdate, (e) => {
            this.setState({
                volume: e.jPlayer.options.volume,
                progress: e.jPlayer.status.currentPercentRelative,
                left: this.formatTime(e.jPlayer.status.duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100)),
            });
            if(this.state.progress===100){
                if(this.props.repeat_type==="once"){
                    $("#player").jPlayer("repeat")
                }
                else if(this.props.repeat_type==="cycle"){
                    this.playNext(this.props.current_musicitem);
                }
                else if(this.props.repeat_type==="random"){
                    this.playRadom(this.props.current_musicitem)
                }
            }
        });
    },
    componentWillUnmount() {
        $('#player').unbind($.jPlayer.event.timeupdate)
    },
    render() {
        return (
            <div>
                <div className="player-page">
                    <h1 className="caption"><Link to="/list">音乐坊by楷楷的小仙女</Link></h1>
                    <div className="mt20 row">
                        <div className="controll-wrapper">
                            <h2 className="music-title">{this.props.current_musicitem.title}</h2>
                            <h3 className="music-artist mt10">{this.props.current_musicitem.artist}</h3>
                            <div className="row mt20">
                                <div className="left-time -col-auto">-{this.state.left}</div>
                                <div className="volume-container">
                                    <i className="icon-volume rt"
                                       style={{top: 5, left: -5}}>
                                    </i>
                                    <div className="volume-wrapper">
                                        <Progress
                                            progress={this.state.volume * 100}
                                            onChangeProgress={this.pchangeVolume}
                                        >
                                        </Progress>
                                    </div>
                                </div>
                            </div>
                            <div style={{height: 10, lineHeight: '10px'}}>
                                <Progress
                                    progress={this.state.progress}
                                    onChangeProgress={this.pchangeProgress}
                                >
                                </Progress>
                            </div>
                            <div className="mt35 row">
                                <div>
                                    <i className="icon prev"
                                       onClick={this.playPre.bind(this, this.props.current_musicitem)}>
                                    </i>
                                    <i className={`icon ml20 ${this.state.is_play ? 'pause' : 'play'}`}
                                       onClick={this.playmusic}>
                                    </i>
                                    <i className="icon next ml20"
                                       onClick={this.playNext.bind(this, this.props.current_musicitem)}>
                                    </i>
                                </div>
                                <div className="-col-auto">
                                    <i className={`icon repeat-${this.props.repeat_type}`}
                                       onClick={this.changeRepeat}>
                                    </i>
                                </div>
                            </div>
                        </div>
                        <div className="-col-auto cover">
                            <img src={this.props.current_musicitem.cover}
                                 alt={this.props.current_musicitem.title}>
                            </img>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});

export default Player;