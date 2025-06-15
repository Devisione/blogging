import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

interface ExternalValuePluginProps {
  value: string;
}

export const ExternalValuePlugin = ({ value }: ExternalValuePluginProps) => {
  const [editor] = useLexicalComposerContext();
  const lastValueRef = useRef<string>('');

  useEffect(() => {
    // Обновляем содержимое редактора только если значение действительно изменилось
    if (lastValueRef.current !== value) {
      editor.update(() => {
        const root = $getRoot();
        const currentText = root.getTextContent();
        
        // Проверяем, действительно ли значение изменилось
        if (currentText !== value) {
          // Очищаем текущее содержимое
          root.clear();
          
          if (value) {
            // Создаем новый параграф с текстом
            const paragraph = $createParagraphNode();
            const text = $createTextNode(value);
            paragraph.append(text);
            root.append(paragraph);
          }
        }
      });
      
      lastValueRef.current = value;
    }
  }, [editor, value]);

  return null;
}; 