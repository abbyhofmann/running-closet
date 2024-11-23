import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { SearchUsersProps, User } from '../../../../types';
import useCreateConversation from '../../../../hooks/useCreateConversation';
import ProfileAvatar from '../../../profileAvatar';

/**
 * Represent the create conversation component.
 * @param setAlert - a function that sets the alert message.
 * @returns the create conversation component.
 */
export default function SearchUsers(props: SearchUsersProps) {
  const { setAlert, navigate, setConversations, conversations } = props;

  const formatName = (user: User) => `${user.firstName} ${user.lastName} (${user.username})`;

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
  } = useCreateConversation(setAlert, navigate, setConversations, conversations, formatName);

  return (
    // From MUI. Only changed name and inputs.
    <Root
      sx={{
        marginTop: 5,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1,
        minWidth: 1,
      }}>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()} sx={{ marginTop: 5, color: '#32292F' }}>
          <Typography variant='h5'>Create a new conversation with:</Typography>
        </Label>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}>
          <InputWrapper
            ref={setAnchorEl}
            className={focused ? 'focused' : ''}
            sx={{
              flex: '0 0 70%',
              display: 'flex',
              alignItems: 'center',
              marginRight: 1,
            }}>
            {value.map((option: User, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <StyledTag
                  key={key}
                  profileGraphic={option.profileGraphic}
                  {...tagProps}
                  label={formatName(option)}
                />
              );
            })}
            <input {...getInputProps()} />
          </InputWrapper>

          <Box flex='0 0 20%'>
            <Button
              variant='contained'
              fullWidth
              onClick={createConversation}
              disabled={value.length === 0}
              sx={{ bgcolor: '#5171A5', marginLeft: 4 }}>
              <Add sx={{ marginRight: 1 }}></Add>
            </Button>
          </Box>
        </Box>
      </div>

      <Box>
        <Box>
          {groupedOptions.length > 0 ? (
            <Listbox {...getListboxProps()}>
              {((groupedOptions as typeof allUsers) || []).map((option, index) => {
                const { key, ...optionProps } = getOptionProps({ option, index });
                return (
                  <li key={key} {...optionProps}>
                    <ProfileAvatar profileGraphic={option.profileGraphic} size={20}></ProfileAvatar>
                    <span style={{ marginLeft: 8 }}>{formatName(option)}</span>
                    <CheckIcon fontSize='small' />
                  </li>
                );
              })}
            </Listbox>
          ) : null}
        </Box>
      </Box>
    </Root>
  );
}
