'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { useState, useEffect, useRef } from 'react'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Heading1,
  Heading2,
  Heading3,
  Table as TableIcon,
  Info,
  FileText,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const ARTICLE_TEMPLATES = [
  {
    name: 'Матч-репорт',
    content: `<h2>Обзор матча</h2>
<p>Краткое описание игры и итогового счёта.</p>

<h3>Ключевые моменты</h3>
<ul>
  <li>Первый тайм: описание</li>
  <li>Второй тайм: описание</li>
</ul>

<h3>Лучшие игроки</h3>
<p>Выделившиеся футболисты матча.</p>

<h3>Статистика</h3>
<p>Основные показатели команд.</p>

<h3>Итоги</h3>
<p>Заключение и значение результата.</p>`,
  },
  {
    name: 'Превью матча',
    content: `<h2>Превью матча: [Команда 1] vs [Команда 2]</h2>
<p>Дата и время проведения, стадион.</p>

<h3>Текущая форма команд</h3>
<p>Последние результаты обеих команд.</p>

<h3>Травмы и дисквалификации</h3>
<p>Кто не сможет выйти на поле.</p>

<h3>Личные встречи</h3>
<p>История противостояний.</p>

<h3>Прогноз</h3>
<p>Ожидаемый результат и обоснование.</p>`,
  },
  {
    name: 'Трансферная новость',
    content: `<h2>Трансфер: [Игрок] переходит в [Клуб]</h2>
<p>Официальное подтверждение трансфера.</p>

<h3>Детали сделки</h3>
<p>Сумма трансфера, условия контракта.</p>

<h3>Карьера игрока</h3>
<p>Достижения и статистика.</p>

<h3>Что это значит для клуба</h3>
<p>Как трансфер усилит команду.</p>`,
  },
  {
    name: 'Аналитика',
    content: `<h2>Анализ: [Тема]</h2>
<p>Введение в тему анализа.</p>

<h3>Контекст</h3>
<p>Предыстория и текущая ситуация.</p>

<h3>Ключевые факторы</h3>
<ul>
  <li>Фактор 1</li>
  <li>Фактор 2</li>
  <li>Фактор 3</li>
</ul>

<h3>Выводы</h3>
<p>Заключение и прогнозы.</p>`,
  },
]

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed ${
        active ? 'bg-slate-200 text-blue-500' : 'text-slate-600'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [showTemplates, setShowTemplates] = useState(false)
  const isInitialMount = useRef(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'rounded-lg aspect-video',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-slate-300 w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 bg-slate-100 p-2 font-semibold text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-300 p-2',
        },
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  })

  // Sync content when prop changes (critical for loading existing data)
  useEffect(() => {
    if (editor && content !== undefined) {
      // Only update if content is different from current editor content
      const currentContent = editor.getHTML()
      // On initial mount or when content prop is different from what editor has
      if (isInitialMount.current || (content && content !== currentContent && content !== '<p></p>')) {
        // Don't update if it's just empty variations
        const normalizedContent = content || ''
        const normalizedCurrent = currentContent === '<p></p>' ? '' : currentContent

        if (normalizedContent !== normalizedCurrent) {
          editor.commands.setContent(content || '')
        }
        isInitialMount.current = false
      }
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <div className="p-4 min-h-[400px] bg-slate-50 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const addLink = () => {
    const url = window.prompt('Введите URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt('Введите URL изображения:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addYoutube = () => {
    const url = window.prompt('Введите URL YouTube видео:')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  const insertInfoBox = (type: 'info' | 'warning' | 'success') => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
    }
    const html = `<div class="p-4 rounded-lg border-l-4 ${colors[type]} my-4"><p>Введите текст информационного блока...</p></div>`
    editor.chain().focus().insertContent(html).run()
  }

  const applyTemplate = (template: typeof ARTICLE_TEMPLATES[0]) => {
    if (confirm(`Применить шаблон "${template.name}"? Текущий контент будет заменён.`)) {
      editor.commands.setContent(template.content)
      onChange(template.content)
    }
    setShowTemplates(false)
  }

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-slate-50">
        {/* Templates Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Шаблоны</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showTemplates && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-20">
                {ARTICLE_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Заголовок 1"
        >
          <Heading1 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Заголовок 2"
        >
          <Heading2 className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Заголовок 3"
        >
          <Heading3 className="w-5 h-5" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Жирный"
        >
          <Bold className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Курсив"
        >
          <Italic className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Зачёркнутый"
        >
          <Strikethrough className="w-5 h-5" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Маркированный список"
        >
          <List className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Нумерованный список"
        >
          <ListOrdered className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Цитата"
        >
          <Quote className="w-5 h-5" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Table */}
        <ToolbarButton
          onClick={insertTable}
          title="Вставить таблицу"
        >
          <TableIcon className="w-5 h-5" />
        </ToolbarButton>

        {/* Info Boxes */}
        <ToolbarButton
          onClick={() => insertInfoBox('info')}
          title="Информационный блок"
        >
          <Info className="w-5 h-5 text-blue-500" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertInfoBox('warning')}
          title="Предупреждение"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertInfoBox('success')}
          title="Успех"
        >
          <CheckCircle className="w-5 h-5 text-green-500" />
        </ToolbarButton>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <ToolbarButton
          onClick={addLink}
          active={editor.isActive('link')}
          title="Добавить ссылку"
        >
          <LinkIcon className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Добавить изображение">
          <ImageIcon className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutube} title="Добавить YouTube видео">
          <YoutubeIcon className="w-5 h-5" />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Отменить"
        >
          <Undo className="w-5 h-5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Повторить"
        >
          <Redo className="w-5 h-5" />
        </ToolbarButton>
      </div>

      {/* Table Controls (shown when inside a table) */}
      {editor.isActive('table') && (
        <div className="flex flex-wrap items-center gap-2 px-2 py-1 border-b bg-slate-100 text-sm">
          <span className="text-slate-500">Таблица:</span>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="px-2 py-1 hover:bg-slate-200 rounded"
          >
            + Колонка слева
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-1 hover:bg-slate-200 rounded"
          >
            + Колонка справа
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-1 hover:bg-red-100 text-red-600 rounded"
          >
            Удалить колонку
          </button>
          <div className="w-px h-4 bg-slate-300" />
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="px-2 py-1 hover:bg-slate-200 rounded"
          >
            + Строка сверху
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-1 hover:bg-slate-200 rounded"
          >
            + Строка снизу
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-1 hover:bg-red-100 text-red-600 rounded"
          >
            Удалить строку
          </button>
          <div className="w-px h-4 bg-slate-300" />
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-1 hover:bg-red-100 text-red-600 rounded"
          >
            Удалить таблицу
          </button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
