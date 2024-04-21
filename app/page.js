'use client'
// import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import * as htmlparser2 from "htmlparser2";
import * as babelParser from '@babel/parser'
import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const [onlineTime, setOnlineTime] = useState('-1');
  const [remain, setRemain] = useState('-1');
  const [studentNumber, setStudentNumber] = useState('-1');
  const [ipv4, setIpv4] = useState('-1');
  const [ipv6, setIpv6] = useState('-1');
  useEffect(() => {
    axios.get('/api/').then((v) => {
      let ast, time, flow, snum, v4, v6
      const dom = htmlparser2.parseDocument(v.data);
      try {
        ast = babelParser.parse(dom.children[0].children[1].children[5].children[0].data);

        time = ast.program.body[0].expression;
        flow = ast.program.body[1].expression;
        snum = ast.program.body[10].expression;
        v4 = ast.program.body[13].expression;
        v6 = ast.program.body[14].expression;

        let flow0, flow1, flow3;
        flow0 = parseInt(flow.right.value) % 1024;
        flow1 = parseInt(flow.right.value) - flow0;
        flow0 = flow0 * 1000;
        flow0 = flow0 - flow0 % 1024;

        time.left.name == 'time' ? setOnlineTime(time.right.value) : '-1';
        flow.left.name == 'flow' ? setRemain(flow1 + flow0/1024) : '-1';
        snum.left.name == 'uid' ? setStudentNumber(snum.right.value) : '-1';
        v4.left.name == 'v4ip' ? setIpv4(v4.right.value) : '-1';
        v6.left.name == 'v6ip' ? setIpv6(v6.right.value) : '-1';

        setTimeout(() => {
          setCount(count + 1);
        }, 1000);
      } catch (exception) {
        console.log("Parse Error: " + exception.message);
      }
    })
  }, [count]);

  return (
    <main className={styles.main}>
      <h1>在线时间：{parseInt(onlineTime / 60 / 24)} 天 {parseInt(onlineTime / 60 % 24)} 小时 {onlineTime % 60} 分钟</h1>
      <h1>已用流量：{parseInt(remain / 1024 / 1024)} GByte {parseInt(remain / 1024 % 1024)} MByte {remain % 1024} KByte</h1>
      <h1>学号：{studentNumber}</h1>
      <h1>IPv4 地址：{ipv4}</h1>
      <h1>IPv6 地址：{ipv6}</h1>
      <h1>刷新次数：{count}</h1>
    </main>
  );
}
