import { ActionIcon, Center, createStyles, Flex, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconCopy, IconDownload, IconTrash } from '@tabler/icons';
import fileDownload from 'js-file-download';
import { useTranslation } from 'next-i18next';
import { useConfigContext } from '../../../../config/provider';
import { useConfigStore } from '../../../../config/store';
import { useDeleteConfigMutation } from '../../../../tools/config/mutations/useDeleteConfigMutation';
import Tip from '../../../layout/Tip';
import { CreateConfigCopyModal } from './CreateCopyModal';

export default function ConfigActions() {
  const { t } = useTranslation(['settings/general/config-changer', 'settings/common']);
  const [createCopyModalOpened, createCopyModal] = useDisclosure(false);
  const { config } = useConfigContext();
  const { removeConfig } = useConfigStore();
  const { mutateAsync } = useDeleteConfigMutation(config?.configProperties.name ?? 'default');

  if (!config) return null;

  const handleDownload = () => {
    // TODO: remove secrets
    fileDownload(JSON.stringify(config, null, '\t'), `${config?.configProperties.name}.json`);
  };

  const handleDeletion = async () => {
    const response = await mutateAsync();

    if (response.message) {
      showNotification({
        title: t('buttons.delete.notifications.deleteFailedDefaultConfig.title'),
        message: t('buttons.delete.notifications.deleteFailedDefaultConfig.message'),
      });
      return;
    }

    showNotification({
      title: t('buttons.delete.notifications.deleted.title'),
      icon: <IconCheck />,
      color: 'green',
      autoClose: 1500,
      radius: 'md',
      message: t('buttons.delete.notifications.deleted.message'),
    });

    removeConfig(config?.configProperties.name ?? 'default');
  };

  const { classes } = useStyles();
  const { colors } = useMantineTheme();

  return (
    <>
      <CreateConfigCopyModal
        opened={createCopyModalOpened}
        closeModal={createCopyModal.close}
        initialConfigName={config.configProperties.name}
      />
      <Flex gap="xs" mt="xs" justify="stretch">
        <ActionIcon className={classes.actionIcon} onClick={handleDownload} variant="default">
          <IconDownload size={20} />
          <Text size="sm">{t('buttons.download')}</Text>
        </ActionIcon>
        <ActionIcon
          className={classes.actionIcon}
          onClick={handleDeletion}
          color="red"
          variant="light"
        >
          <IconTrash color={colors.red[2]} size={20} />
          <Text size="sm">{t('buttons.delete.text')}</Text>
        </ActionIcon>
        <ActionIcon className={classes.actionIcon} onClick={createCopyModal.open} variant="default">
          <IconCopy size={20} />
          <Text size="sm">{t('buttons.saveCopy')}</Text>
        </ActionIcon>
      </Flex>

      <Center>
        <Tip>{t('settings/common:tips.configTip')}</Tip>
      </Center>
    </>
  );
}

const useStyles = createStyles(() => ({
  actionIcon: {
    width: 'auto',
    height: 'auto',
    maxWidth: 'auto',
    maxHeight: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    rowGap: 10,
    padding: 10,
  },
}));
