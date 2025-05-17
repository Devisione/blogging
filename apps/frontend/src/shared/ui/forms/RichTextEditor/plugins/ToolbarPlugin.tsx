import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { IconBold, IconItalic, IconUnderline, IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import classes from '../styles.module.css';

export const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = useCallback(
    (format: 'bold' | 'italic' | 'underline') => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor],
  );

  const undo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const redo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return (
    <div className={classes.toolbar}>
      <Group gap="xs">
        <ActionIcon
          onClick={() => { formatText('bold'); }}
          title="Bold (Ctrl+B)"
          variant="light"
        >
          <IconBold size={16} />
        </ActionIcon>
        <ActionIcon
          onClick={() => { formatText('italic'); }}
          title="Italic (Ctrl+I)"
          variant="light"
        >
          <IconItalic size={16} />
        </ActionIcon>
        <ActionIcon
          onClick={() => { formatText('underline'); }}
          title="Underline (Ctrl+U)"
          variant="light"
        >
          <IconUnderline size={16} />
        </ActionIcon>
        <ActionIcon
          onClick={undo}
          title="Undo (Ctrl+Z)"
          variant="light"
        >
          <IconArrowBackUp size={16} />
        </ActionIcon>
        <ActionIcon
          onClick={redo}
          title="Redo (Ctrl+Y)"
          variant="light"
        >
          <IconArrowForwardUp size={16} />
        </ActionIcon>
      </Group>
    </div>
  );
} 