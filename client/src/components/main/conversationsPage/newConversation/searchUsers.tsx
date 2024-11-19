import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Typography } from '@mui/material';
import { SearchUsersProps, User } from '../../../../types';
import useCreateConversation from '../../../../hooks/useCreateConversation';

/**
 * Represent the create conversation component.
 * @param setAlert - a function that sets the alert message.
 * @returns the create conversation component.
 */
export default function SearchUsers(props: SearchUsersProps) {
  const { setAlert, navigate, setConversations, conversations } = props;
  const {
    allUsers,
    Root,
    Label,
    InputWrapper,
    StyledTag,
    Listbox,
    getRootProps,
    setAnchorEl,
    focused,
    value,
    getTagProps,
    getInputLabelProps,
    getInputProps,
    groupedOptions,
    getListboxProps,
    getOptionProps,
    createConversation,
  } = useCreateConversation(setAlert, navigate, setConversations, conversations);
  return (
    // From MUI. Only changed name and inputs.
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()} sx={{ marginTop: 5 }}>
          <Typography variant='h5'>Create a new conversation with:</Typography>
        </Label>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {value.map((option: User, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <StyledTag key={key} {...tagProps} label={option.username} />;
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      <Box>
        <Box flex='0 0 100%'>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {((groupedOptions as typeof allUsers) || []).map((option, index) => {
                const { key, ...optionProps } = getOptionProps({ option, index });
                return (
                  <li key={key} {...optionProps}>
                    <span>{option.username}</span>
                    <CheckIcon fontSize='small' />
                  </li>
                );
              })}
            </Listbox>
          ) : null}
        </Box>
        {/* Added this button which triggers the creation of the conversation */}
        <Box flex='0 0 100%'>
          <Button fullWidth variant='contained' sx={{ marginTop: 1 }} onClick={createConversation}>
            Create Conversation
          </Button>
        </Box>
      </Box>
    </Root>
  );
}
