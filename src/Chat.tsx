import {useContext, useState} from 'react'
import {ShowContext} from './ShowContext'

import {
    Attachments,
    Bubble,
    Conversations,
    ConversationsProps,
    Sender,
    Suggestion,
    useXAgent,
    useXChat,
    Welcome
} from '@ant-design/x';
import {LinkOutlined, UserOutlined, CloudUploadOutlined, OpenAIFilled} from '@ant-design/icons';
import {Button, Flex, type GetProp, theme} from 'antd';

const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
        placement: 'start',
        avatar: {icon: <UserOutlined/>, style: {background: '#fde3cf'}},
    },
    local: {
        placement: 'end',
        avatar: {icon: <UserOutlined/>, style: {background: '#87d068'}},
    },
};

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
    {label: 'Write a report', value: 'report'},
    {label: 'Draw a picture', value: 'draw'},
    {
        label: 'Check some knowledge',
        value: 'knowledge',
        icon: <OpenAIFilled/>,
        children: [
            {
                label: 'About React',
                value: 'react',
            },
            {
                label: 'About Ant Design',
                value: 'antd',
            },
        ],
    },
];

function ChatComponent() {
    const [content, setContent] = useState('');

    // Agent for request
    const [agent] = useXAgent({
        request: async ({message}, {onSuccess, onUpdate, onError}) => {
            const eventSource = new EventSource(`http://localhost:80/ai/stream?text=${message}`);

            eventSource.onmessage = (e) => {
                const data = JSON.parse(e.data);
                if (data.f) {
                    console.log("结束了");
                    onSuccess(data.data);
                    eventSource.close();
                } else {
                    onUpdate(data.data);
                }

            };

            eventSource.onerror = (err: Event) => {
                console.log("错误了");
                onError(new Error(JSON.stringify(err)));
            };
        },
    });

// Chat messages
    const {onRequest, messages} = useXChat({
        agent,
    });

    const hello1 = <Welcome
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
    />


    return (
        <>
            <Flex vertical gap="middle" justify={'flex-end'} className={'grow'} style={{padding: '10px'}}>
                {hello1}
                <Welcome
                    icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                    title="Hello, I'm Ant Design X"
                    description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
                />
                <Bubble.List
                    className={'grow'}
                    roles={roles}
                    items={messages.map(({id, message, status}) => ({
                        key: id,
                        role: status === 'local' ? 'local' : 'ai',
                        content: message,
                    }))}
                />
                <Suggestion
                    items={suggestions}
                    onSelect={(itemVal) => {
                        setContent(`[${itemVal}]:`);
                    }}
                >
                    {({onTrigger, onKeyDown}) => {
                        return (<Sender
                            prefix={
                                <Attachments
                                    beforeUpload={() => false}
                                    onChange={({file}) => {
                                        console.log(file)
                                    }}
                                    placeholder={{
                                        icon: <CloudUploadOutlined/>,
                                        title: 'Drag & Drop files here',
                                        description: 'Support file type: image, video, audio, document, etc.',
                                    }}
                                >
                                    <Button type="text" icon={<LinkOutlined/>}/>
                                </Attachments>
                            }
                            style={{"width": "100%"}}
                            loading={agent.isRequesting()}
                            value={content}
                            onKeyDown={onKeyDown}
                            placeholder="输入 / 获取建议"
                            onChange={(nextVal) => {
                                if (nextVal === '/') {
                                    onTrigger();
                                } else if (!nextVal) {
                                    onTrigger(false);
                                }
                                setContent(nextVal);
                            }}
                            onSubmit={(nextContent) => {
                                onRequest(nextContent);
                                setContent('');
                            }}
                        />)
                    }}
                </Suggestion>
            </Flex>
        </>

    );
}

function History() {
    console.log("touch")
    const {token} = theme.useToken();
    const {showContext, setShowContext} = useContext(ShowContext);
    if (showContext === 1) {
        const items: GetProp<ConversationsProps, 'items'> = Array.from({length: 4}).map((_, index) => ({
            key: `item${index + 1}`,
            label: `Conversation Item ${index + 1}`,
            disabled: index === 3,
        }));
        // Customize the style of the container
        const style = {
            width: 256,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
        };

        return <Conversations style={style} items={items} defaultActiveKey="item1"/>;
    }
    return null
}

function Layout() {
    const [showContext, updateShowContext] = useState(0);
    setTimeout(() => {
        updateShowContext(1)
    }, 5000)
    return (
        <div style={{width: "100%"}} className={'flex bg-blue-200 h-dvh'}>
            <ShowContext.Provider value={{showContext, updateShowContext}}>
                <History/>
                <ChatComponent></ChatComponent>
            </ShowContext.Provider>
        </div>
    )
}

function Chat() {
    return (<div style={{background: 'back'}}>
        <Layout/>
    </div>)
}


export default Chat
