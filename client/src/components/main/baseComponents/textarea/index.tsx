import React from 'react';
import '../input/index.css';
import { Box } from '@mui/system';

/**
 * Interface representing the props for the Textarea component.
 *
 * - title - The label to display
 * - mandatory - Indicates whether the field is required, it's optional.
 * - hint - An optional helper text providing additional information.
 * - id - The unique identifier for the input field.
 * - val - The current value of the input field.
 * - setState - Callback function to update the state with the input field's value.
 * - err - An error message displayed if there's an issue with the input.
 */
interface TextAreaProps {
  title: string;
  mandatory?: boolean;
  hint?: string;
  id: string;
  val: string;
  setState: (value: string) => void;
  err?: string;
}

/**
 * Textarea component renders a customizable input with optional title, hint,
 * error message, and mandatory indication.
 *
 * @param title - The label of the textarea.
 * @param mandatory - Indicates whether the textarea is mandatory. Default is true.
 * @param hint - Optional text providing additional instructions.
 * @param id - The unique identifier of the textarea element.
 * @param val - The current value of the textarea.
 * @param setState - The function to update the state of the textarea value.
 * @param err - Optional error message displayed when there's an issue with input.
 */
const TextArea = ({ title, mandatory = true, hint, id, val, setState, err }: TextAreaProps) => (
  <Box>
    <Box className='input_title'>
      {title}
      {mandatory ? '*' : ''}
    </Box>
    {hint && <Box className='input_hint'>{hint}</Box>}
    <textarea
      id={id}
      className='input_input'
      value={val}
      onChange={e => {
        setState(e.currentTarget.value);
      }}
    />
    {err && <div className='input_error'>{err}</div>}
  </Box>
);

export default TextArea;
