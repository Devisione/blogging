import { useCallback } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Box, Text } from '@mantine/core';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $createParagraphNode, $createTextNode, EditorState } from 'lexical';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import classes from './styles.module.css';

const theme = {
  paragraph: classes.paragraph,
  text: {
    bold: classes.textBold,
    italic: classes.textItalic,
    underline: classes.textUnderline,
  },
};

interface RichTextEditorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  mb?: string | number;
  placeholder?: string;
  toolbar?: boolean;
}

export function RichTextEditor<T extends FieldValues>({ 
  control, 
  name, 
  label,
  mb = 'lg',
  toolbar = true,
  placeholder = 'Enter your text...'
}: RichTextEditorProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const initialConfig = {
          namespace: 'MyEditor',
          theme,
          onError: (error: Error) => {
            console.error(error);
          },
          nodes: [],
          editable: true,
          editorState: value ? () => {
            const root = $getRoot();
            const paragraph = $createParagraphNode();
            const text = $createTextNode(value);
            paragraph.append(text);
            root.append(paragraph);
          } : undefined,
        };

        const onEditorChange = useCallback((editorState: EditorState) => {
          editorState.read(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();
            onChange(textContent);
          });
        }, [onChange]);

        return (
          <Box mb={mb}>
            <Text size="sm" mb="xs">{label}</Text>
            <Box 
              style={{ 
                border: `1px solid ${error ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-gray-4)'}`,
                borderRadius: 'var(--mantine-radius-sm)',
                width: '100%',
              }}
            >
              <LexicalComposer initialConfig={initialConfig}>
                <div className={classes.container}>
                  {toolbar && <ToolbarPlugin />}
                  <div className={classes.editorContainer}>
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable 
                          className={classes.input} 
                          data-placeholder={placeholder}
                        />
                      }
                      placeholder={<div className={classes.placeholder}>{placeholder}</div>}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                  </div>
                  <OnChangePlugin onChange={onEditorChange} />
                  <HistoryPlugin />
                </div>
              </LexicalComposer>
            </Box>
            {error && <Text color="red" size="xs" mt="xs">{error.message}</Text>}
          </Box>
        );
      }}
    />
  );
} 