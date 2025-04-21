import {Button, Grid} from "antd-mobile";
import {Flex, Image} from "antd";
import {InputNumber} from 'antd';
import {useEffect, useState} from "react";
import * as React from "react";

const baseUrl = "http://localhost:8000/ai"

import Editor from '@monaco-editor/react';

function JSONEditor({value, onChange}) {

    const handleEditorChange = (v: any) => {
        try {
            JSON.parse(v);
            onChange(v);
        } catch (e) {
// 处理错误
        }
    };

    return (
        <Editor
            width="50%"
            height="500px"
            defaultLanguage="json"
            value={value}
            onChange={handleEditorChange}
            options={{
                minimap: {enabled: false},
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true,
            }}
        />
    );
}

function Compare({patchResUrl, v1, v2}) {
    return (<div>
        <Flex vertical={false}>
            <JSONEditor value={v1}></JSONEditor>
            <JSONEditor value={v2} onChange={(v) => {
                fetch(baseUrl + "/file/json/save", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ossUrl: patchResUrl,
                        data: v
                    })
                }).then(res => res.json()).then(res => {
                    console.log(res)
                }).catch(e => {
                    alert(e)
                })
            }}></JSONEditor>
        </Flex>

    </div>)
}


const A = React.memo(() => {
    console.log("重新渲染")

    const [fileIndex, setFileIndex] = useState(0);
    const [ossUrl, setOssUrl] = useState("");
    const [patchResUrl, setPatchResUrl] = useState("");
    const [classOssUrl, setClassOssUrl] = useState({});
    const [chat, setChat] = useState("");
    const [chat1, setChat1] = useState("");
    const [chat2, setChat2] = useState("");
    const [fileList, setFileList] = useState<any[]>([]);


    useEffect(() => {
        console.log("首次渲染")
        fetch(baseUrl + "/file/list")
            .then(res => res.json())
            .then(res => {
                setFileList(res.data);
                console.log(`fileIndex = ${fileIndex}`)
                console.log(`fileList size is ${fileList.length}`)
                addIndex(0)
            }).catch(e => {
            alert(e)
        })
    }, [])


    useEffect(() => {
        if (fileList.length > 0) {
            setOssUrl(fileList[fileIndex].ossUrl)
            setPatchResUrl(fileList[fileIndex].patchResUrl)
            setClassOssUrl({})
        }
    }, [fileList, fileIndex])

    function addIndex(num: number) {
        setIndex(fileIndex + num)
    }

    function setIndex(fileIndex: number) {
        if (fileIndex < 0) {
            setFileIndex(fileList.length - 1)
        } else if (fileIndex > fileList.length) {
            setFileIndex(0)
        } else {
            setFileIndex(fileIndex)
        }

        setChat("")
        setChat1("")
        setChat2("")
    }


    function renewIndex(reNew: boolean = false) {
        setChat("加载中")

        fetch(baseUrl + "/file/ocr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reNew: reNew,
                ossUrl: fileList[fileIndex].ossUrl,
                promipt: '按行解析数据。其中第4行的格式是≥数字,例如≥560。不要把.看错成-，不然打死你。严格按照标准json格式返回,json的key是行号,例如{"1":"123456789","2":"11.23"}'
            }),
        }).then(res => res.json()).then(res => {
            console.log(res)
            setChat(JSON.stringify(res.data))
            setClassOssUrl(fileList[fileIndex].classOssUrl)
            fetchRes()

        }).catch(e => {
            alert(e)
        })
    }


    function fetchRes() {
        fetch(fileList[fileIndex].rawResUrl, {cache: "no-cache"}).then(res => res.text()).then(res => {
            setChat1(res)
        }).catch(e => {
            alert(e)
            setChat1(e)
        })
        fetch(fileList[fileIndex].patchResUrl, {cache: "no-cache"}).then(res => res.text()).then(res => {
            setChat2(res)
        }).catch(e => {
            alert(e)
            setChat2(e)
        })
    }


    return <div>
        <div style={{position: "fixed", top: 50, left: 0, background: "#fff", zIndex: 500}}>
            <h2>{chat}</h2>
            <Button color='primary' fill='solid' onClick={() => {
                addIndex(-1)
            }}>
                上一张
            </Button>
            <Button color='primary' fill='solid' onClick={() => {
                addIndex(1)
            }}>
                下一张
            </Button>
            <InputNumber value={fileIndex} onChange={(v) => {
                console.log("切换到" + v)
                setIndex(v ? v : 0)
            }}/>
            <div>共{fileList.length}张</div>
            <Button color='primary' fill='solid' onClick={() => {
                renewIndex()
            }}>
                识别
            </Button>
            <Button color='primary' fill='solid' onClick={() => {
                renewIndex(true)
            }}>
                刷新识别
            </Button>
        </div>
        <Flex style={{"marginTop": "200px"}} justify="start">
            <div>
                <div>{ossUrl}</div>
                <Image preview={false} src={ossUrl} width={1800} height={1500} style={{border: "red 2px solid"}}/>
            </div>

            <Image.PreviewGroup
                preview={{
                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                }}
            >
                <Flex vertical={true} justify="start" style={{width: '50px'}}>
                    <Image src={ossUrl} width={200} height={200}/>
                    {Object.entries(classOssUrl).map(([key, value]) => (<div>
                        <div>{key}</div>
                        <Image src={value} width={200} height={200}/></div>)
                    )}
                </Flex>

            </Image.PreviewGroup>
        </Flex>
        <Compare patchResUrl={patchResUrl} v1={chat1} v2={chat2}></Compare>

    </div>
})

export default A
