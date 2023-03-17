import { useState, useEffect, useCallback } from 'react'
import { Button } from '@arco-design/web-react'
import text from './assets/demo'

type Label = {
  id: string,
  text: string,
  start: number,
  end: number,
}
const formatedText = formatText(text)

// 生成ID，例如A1,A2,A3...B1,B2...,Z1,Z2
function generateID(index: number) {
  const alphabetList = [...Array(26)].map((_, i) => String.fromCharCode(65 + i)) // 生成 A - Z 数组
  const alphabet = alphabetList[Math.floor(index / 26)] // 获取字母
  const number = (index % 26) + 1 // 获取数字
  return `${alphabet}${number}`
}

// 格式化文本,使用<br>标签替换换行符,去除空行
function formatText(text: string): string {
  return text.replace(/^\s*\n/gm, "").replace(/\n/g, "<br>")
}

// 获取页面上被选中的文本, 并返回在 text 中的索引起始位置
function getSelection(formatedText: string) {
  const selection = window.getSelection()
  if (!selection) {
    return { text: '', start: 0, end: 0 }
  }
  const text = selection.toString()
  // 查询text 在 formatedText 中的起始位置
  const start = formatedText.indexOf(text)
  const end = start + text.length
  return { text, start, end }
}

function App() {
  const [labels, setLabels] = useState<Label[]>([])
  const onLabel = () => {
    const { text, start, end } = getSelection(formatedText)
    setLabels(() => {
      return [...labels, { id: generateID(labels.length), text, start, end }]
    })
  }
  useEffect(() => {
    let replacedText = formatedText
    labels.forEach((label) => {
      const tag = `<span class="bg-red-500">${label.id}</span>`
      const span = `<span id="${label.id}" class="border-b-2 border-blue-500">${label.text}</span>`
      replacedText = replacedText.replace(label.text, tag + span)
      document.querySelector('#article-container')!.innerHTML = replacedText
    })
    
  }, [labels])
  return (
    <div className="container mx-auto bg-white p-6 my-6 rounded-lg shadow-lg">
      <div>
        <Button type="primary" onClick={onLabel}>Label</Button>
      </div>
      <article className="whitespace-pre-wrap" id="article-container" dangerouslySetInnerHTML={{__html: formatText(text)}}>
      </article>
    </div>
  )
}

export default App
