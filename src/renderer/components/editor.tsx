// Credit goes in large part to https://github.com/superRaytin/react-monaco-editor,
// this component is a changed version of it.

import * as React from 'react';
import * as MonacoType from 'monaco-editor';
import { AppState } from '../state';
import { getContent, ContentNames } from '../content';

export interface EditorProps {
  appState: AppState;
  monaco: typeof MonacoType;
  id: string;
  options?: Partial<MonacoType.editor.IEditorConstructionOptions>;
  editorDidMount?: (editor: MonacoType.editor.IStandaloneCodeEditor) => void;
  onChange?: (value: string, event: MonacoType.editor.IModelContentChangedEvent) => void;
}

export class Editor extends React.Component<EditorProps> {
  public containerElement: HTMLElement | null = null;
  public editor: MonacoType.editor.IStandaloneCodeEditor;
  public language: string = 'javascript';
  public value: string = '';

  constructor(props: EditorProps) {
    super(props);

    this.language = props.id === 'html' ? 'html' : 'javascript';
  }

  public shouldComponentUpdate() {
    return false;
  }

  public componentDidMount() {
    this.initMonaco();
  }

  public componentWillUnmount() {
    this.destroyMonaco();
  }

  public editorDidMount(editor: MonacoType.editor.IStandaloneCodeEditor) {
    const { editorDidMount } = this.props;

    window.ElectronFiddle.editors[this.props.id] = editor;

    if (editorDidMount) {
      editorDidMount(editor);
    }
  }

  public async initMonaco() {
    const { options, monaco, id } = this.props;

    if (this.containerElement) {
      this.editor = monaco.editor.create(this.containerElement, {
        language: this.language,
        theme: 'main',
        minimap: {
          enabled: false
        },
        contextmenu: false,
        value: await getContent(id as ContentNames),
        ...options
      });
      this.editorDidMount(this.editor);
    }
  }

  public destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }

  public assignRef = (component) => {
    this.containerElement = component;
  }

  public render() {
    return <div className='editorContainer' ref={this.assignRef} />;
  }
}
