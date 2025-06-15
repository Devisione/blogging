import { useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { EditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Box, Text } from "@mantine/core";
import { $getRoot, TextNode } from "lexical";
import { ExternalValuePlugin } from "./plugins/ExternalValuePlugin";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import classes from "./styles.module.css";

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

export const RichTextEditor = <T extends FieldValues>({
  control,
  name,
  label,
  mb = "lg",
  toolbar = true,
  placeholder = "Enter your text...",
}: RichTextEditorProps<T>) => {
  const onEditorChange = useCallback(
    (onChange: (value: string) => void, editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const paragraphs = root.getChildren();

        const textContent = paragraphs
          .map((node) => node.getTextContent())
          .join("\n");

        onChange(textContent);
      });
    },
    [],
  );

  // Создаем стабильную конфигурацию для LexicalComposer
  const initialConfig = useMemo(
    () => ({
      namespace: "MyEditor",
      theme,
      onError: (errorField: Error) => {
        console.error(errorField);
      },
      nodes: [TextNode],
      editable: true,
    }),
    [],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <Box mb={mb} flex={1}>
            <Text mb="xs" size="sm">
              {label}
            </Text>
            <Box
              style={{
                border: `1px solid ${error ? "var(--mantine-color-red-6)" : "var(--mantine-color-gray-4)"}`,
                borderRadius: "var(--mantine-radius-sm)",
                overflow: "auto",
                width: "100%",
              }}
            >
              <LexicalComposer initialConfig={initialConfig}>
                <div className={classes.container}>
                  {toolbar ? <ToolbarPlugin /> : null}
                  <div className={classes.editorContainer}>
                    <RichTextPlugin
                      ErrorBoundary={LexicalErrorBoundary}
                      contentEditable={
                        <ContentEditable
                          className={classes.input}
                          data-placeholder={placeholder}
                          onChange={onChange}
                        />
                      }
                      placeholder={
                        <div className={classes.placeholder}>{placeholder}</div>
                      }
                    />
                  </div>
                  <OnChangePlugin
                    onChange={(state) => {
                      onEditorChange(onChange, state);
                    }}
                  />
                  <HistoryPlugin />
                  <ExternalValuePlugin value={value || ""} />
                </div>
              </LexicalComposer>
            </Box>
            {error ? (
              <Text color="red" mt="xs" size="xs">
                {error.message}
              </Text>
            ) : null}
          </Box>
        );
      }}
    />
  );
};
