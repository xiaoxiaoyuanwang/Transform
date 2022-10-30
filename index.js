// index.js
import React, { PureComponent } from 'react';
import { Switch } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import './index.css';
import moment from 'moment';
Storage.prototype.setExpire = (key, value, expire) => {
  let obj = {
    data: value,
    time: Date.now(),
    expire: expire,
  };
  //localStorage 设置的值不能为对象,转为json字符串
  localStorage.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getExpire = (key) => {
  let val = localStorage.getItem(key);
  if (!val) {
    return val;
  }
  val = JSON.parse(val);
  if (Date.now() - val.time > val.expire) {
    localStorage.removeItem(key);
    return null;
  }
  return val.data;
};
export default class Transform extends PureComponent {
  constructor(props) {
    super(props);
    let storage = localStorage.getExpire(`floatFlag`);
    if (storage == 'false' || storage == false) {
      storage = false;
    } else {
      storage = true;
    }
    this.state = {
      showBurst: false, // burst
      pathBurst: '', // burst path
      timeBurst: '', // burst time
      showFloat: false,
      showBtn: false,
      floatFlag: storage,
      floatList: [],
    };
  }

  componentDidMount() {
    this.getTableList();
  }
  // 获取七条数据
  initList(data, cb) {
    if (data && data.length < 7) {
      let dt = data.concat(data);
      this.initList(dt, cb);
    } else {
      cb(data.slice(0, 7));
    }
  }
  // 获取列表
  getTableList() {
    let list = [
      {
        showoption: 'btn',
        starttime: '2022-09-03',
        endtime: '3023-09-03',
        imagaddress: [
          {
            path: 'https://img-blog.csdnimg.cn/3e93fe58b6444c2c8165e85756118888.png',
          },
        ],
      },
      {
        showoption: 'burst',
        starttime: '2022-09-03',
        endtime: '3023-09-03',
        imagaddress: [
          {
            path: 'https://img-blog.csdnimg.cn/a1c4ddc6b73b48c5a88512eba3a907fa.jpeg',
          },
        ],
      },
      {
        showoption: 'float',
        starttime: '2022-09-03',
        endtime: '3023-09-03',
        imagaddress: [
          {
            path: 'https://img-blog.csdnimg.cn/3e93fe58b6444c2c8165e85756118888.png',
          },
          {
            path: 'https://img-blog.csdnimg.cn/3e93fe58b6444c2c8165e85756118888.png',
          },
        ],
      },
      {
        showoption: 'header',
        starttime: '2022-09-03',
        endtime: '3023-09-03',
        imagaddress: [
          {
            path: 'https://img-blog.csdnimg.cn/a1c4ddc6b73b48c5a88512eba3a907fa.jpeg',
          },
        ],
      },
    ];
    this.setState(
      {
        tableList: list,
      },
      () => {
        this.initStyle();
      },
    );
  }
  add0(m) {
    return m < 10 ? '0' + m : m;
  }
  initStyle() {
    try {
      let tableList = JSON.parse(JSON.stringify(this.state.tableList));
      let resDt = [];
      let time = new Date();
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var H = time.getHours();
      var FEN = time.getMinutes();
      var Miao = time.getSeconds();
      let newDe = moment(
        `${y}-${this.add0(m)}-${this.add0(d)} ${this.add0(H)}:${this.add0(FEN)}:${this.add0(Miao)}`,
      ).format('YYYY-MM-DD HH:mm:ss');
      for (let index = 0; index < tableList.length; index++) {
        const element = tableList[index];
        let strDe = moment(`${element.starttime} 00:00:00`).format('YYYY-MM-DD HH:mm:ss');
        let endDe = moment(`${element.endtime} 23:59:59`).format('YYYY-MM-DD HH:mm:ss');
        if (moment(strDe).isBefore(moment(newDe)) && moment(newDe).isBefore(moment(endDe))) {
          resDt.push(element);
          // break;
        }
      }
      if (resDt && resDt.length > 0) {
        for (let idx = 0; idx < resDt.length; idx++) {
          const element = resDt[idx];
          if (element.showoption == 'float') {
            let str = element.imagaddress;
            let list = [];
            this.initList(str, (dt) => {
              list = dt;
            });
            this.setState({
              showFloat: true,
              showBtn: true,
              floatList: list,
            });
          } else if (element.showoption == 'btn') {
            let strBtn = element.imagaddress[0].path;
            let sty = `
              .ant-btn::before {
                  content: " ";
                  display: block;
                  background: url(${strBtn}) no-repeat!important;
                  background-size: 20px !important;
                  height: 100%;
                  width: 100%;
                  position: absolute;
                  top: -10px;
                  left: -10px;
                  opacity: 1;
              }
              `;
            let sty2 = `
              .ant-btn::before {
                  content: " ";
                  display: block;
                  background: transparent!important;
                  background-size: 20px !important;
                  height: 100%;
                  width: 100%;
                  position: absolute;
                  top: -10px;
                  left: -10px;
                  opacity: 1;
              }
              `;
            this.loadStyleString(sty);
          } else if (element.showoption == 'burst') {
            let tmZl = `${y}-${this.add0(m)}-${this.add0(d)}`;
            let flag = true;
            if (localStorage.getExpire(`timeBurstLocal`) == `${tmZl}`) {
              flag = false;
            }
            this.setState({
              showBurst: flag,
              pathBurst: element.imagaddress[0].path,
              timeBurst: tmZl,
            });
          } else if (element.showoption == 'header') {
            let strH = element.imagaddress[0].path;
            let styH = `
              .ant-pro-global-header {
                background-image: url(${strH});
                background-repeat: no-repeat;
                background-size: cover;
                // opacity: 0.8;
              }
              `;
            this.loadStyleString(styH);
          }
        }
      } else {
        this.setState({
          showFloat: false,
          showBtn: false,
          floatFlag: false,
          floatList: [],
        });
      }
    } catch (error) {
      this.setState({
        showFloat: false,
        showBtn: false,
        floatFlag: false,
        floatList: [],
      });
    }
  }
  loadStyleString(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    try {
      style.appendChild(document.createTextNode(css));
    } catch (ex) {
      style.styleSheet.cssText = css; //兼容IE
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }
  // burst关闭
  CloseBurst() {
    this.setState(
      {
        showBurst: false,
        timeBurstLocal: this.state.timeBurst,
      },
      () => {
        // 有效期一天
        localStorage.setExpire(`timeBurstLocal`, `${this.state.timeBurstLocal}`, 86400000 * 1);
      },
    );
  }
  // 调用示例
  // 　　loadStyleString("body{background-color:red}");
  selectHtml() {
    if (this.state.showFloat && this.state.floatFlag) {
      return (
        <React.Fragment>
          {this.state.floatList
            ? this.state.floatList.map((item, index) => {
                let width = Math.round(Math.random() * 20 + 30);
                return (
                  <div key={index} className={`animation${index}`}>
                    <img width={width} src={item.path} />
                  </div>
                );
              })
            : ''}
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
  // 调用示例
  selectHtmlBurst() {
    var tempHeightRight = document.documentElement.clientHeight - 100;
    if (this.state.showBurst && this.state.pathBurst) {
      return (
        <React.Fragment>
          <div
            onClick={() => {
              this.CloseBurst();
            }}
            className="shadeWrapper"
            style={{ cursor: 'pointer' }}
          >
            <div
              onClick={() => {
                this.CloseBurst();
              }}
              className="shadeClose"
            >
              <CloseCircleOutlined />
            </div>
            <div>
              <img style={{ maxHeight: tempHeightRight }} src={this.state.pathBurst} />
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
  // 开启/关闭特效
  switchCheck(e) {
    // 有效期七天
    localStorage.setExpire(`floatFlag`, e, 86400000 * 7);
    this.setState(
      {
        floatFlag: e,
      },
      () => {
        console.log('e', e);
        // this.initStyle();
      },
    );
  }
  render() {
    return (
      <React.Fragment>
        {this.state.showBtn ? (
          <div
            style={{
              display: 'inline-block',
              position: 'fixed',
              top: '10px',
              right: '300px',
              zIndex: '31',
            }}
          >
            <Switch
              checkedChildren="关闭特效"
              unCheckedChildren="开启特效"
              checked={this.state.floatFlag}
              onChange={(e) => this.switchCheck(e)}
            />
          </div>
        ) : null}
        {this.selectHtmlBurst()}
        {this.selectHtml()}
      </React.Fragment>
    );
  }
}
