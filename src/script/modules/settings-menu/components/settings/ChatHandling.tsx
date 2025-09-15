import React from 'react';
import { Radio, Stack } from '@mantine/core';
import useSettingState from '../../../../hooks/useSettingState';
import { ChatHandling } from '../../../../lib/constants';

const NAME = 'Message Handling';

const DEFAULT_NAME = 'Default';
const DEFAULT_DESCRIPTION = 'Do what Snapchat normally does.';

const AUTO_SAVE_NAME = 'Auto-Save Messages';
const AUTO_SAVE_DESCRIPTION = 'Automatically save all messages to your history.';



function ChatHandling_() {
  const [chatHandling, setChatHandling] = useSettingState('CHAT_HANDLING');
  return (
    <Radio.Group label={NAME} value={chatHandling} onChange={(value) => setChatHandling(value as ChatHandling)}>
      <Stack>
        <Radio value={ChatHandling.DEFAULT} label={DEFAULT_NAME} description={DEFAULT_DESCRIPTION} />
        <Radio value={ChatHandling.AUTO_SAVE} label={AUTO_SAVE_NAME} description={AUTO_SAVE_DESCRIPTION} />
      </Stack>
    </Radio.Group>
  
  );
}

export default {
  name: [NAME, DEFAULT_NAME, AUTO_SAVE_NAME],
  description: [DEFAULT_DESCRIPTION, AUTO_SAVE_DESCRIPTION],
  component: ChatHandling_,
};
