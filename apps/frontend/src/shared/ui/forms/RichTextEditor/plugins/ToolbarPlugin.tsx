import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback } from 'react';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { IconBold, IconItalic, IconUnderline, IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react';
import { ActionIcon, Group } from '@mantine/core';
import classes from '../styles.module.css';

export function ToolbarPlugin() {
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
          variant="light"
          onClick={() => formatText('bold')}
          title="Bold (Ctrl+B)"
        >
          <IconBold size={16} />
        </ActionIcon>
        <ActionIcon
          variant="light"
          onClick={() => formatText('italic')}
          title="Italic (Ctrl+I)"
        >
          <IconItalic size={16} />
        </ActionIcon>
        <ActionIcon
          variant="light"
          onClick={() => formatText('underline')}
          title="Underline (Ctrl+U)"
        >
          <IconUnderline size={16} />
        </ActionIcon>
        <ActionIcon
          variant="light"
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          <IconArrowBackUp size={16} />
        </ActionIcon>
        <ActionIcon
          variant="light"
          onClick={redo}
          title="Redo (Ctrl+Y)"
        >
          <IconArrowForwardUp size={16} />
        </ActionIcon>
      </Group>
    </div>
  );
} 