import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useRef, useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPEPTS } from '../constants';
import Output from './Output';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    socket.on('codeChange', (data) => {
      if (editorRef.current) {
        editorRef.current.setValue(data);
      }
    });

    socket.on('languageChange', (language) => {
      setLanguage(language);
      setValue(CODE_SNIPEPTS[language]);
    });

    return () => {
      socket.off('codeChange');
      socket.off('languageChange');
    };
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPEPTS[language]);
    socket.emit('languageChange', language);
  };

  const onChange = (value) => {
    setValue(value);
    socket.emit('codeChange', value);
  };

  return (
    <Box>
      <HStack spacing={4}>
        <Box w='50%'>
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            height='75vh'
            theme='vs-dark'
            language={language}
            value={value}
            onMount={onMount}
            onChange={onChange}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
    </Box>
  );
};

export default CodeEditor;
