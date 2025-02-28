import { Title } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import { openContextModalGeneric } from '../../../../tools/mantineModalManagerExtensions';
import WidgetsDefinitions from '../../../../widgets';
import { IWidget } from '../../../../widgets/widgets';
import { useWrapperColumnCount } from '../../Wrappers/gridstack/store';
import { GenericTileMenu } from '../GenericTileMenu';
import { WidgetEditModalInnerProps } from './WidgetsEditModal';
import { WidgetsRemoveModalInnerProps } from './WidgetsRemoveModal';

export type WidgetChangePositionModalInnerProps = {
  widgetId: string;
  widgetType: string;
  widget: IWidget<string, any>;
  wrapperColumnCount: number;
};

interface WidgetsMenuProps {
  integration: string;
  widget: IWidget<string, any> | undefined;
}

export const WidgetsMenu = ({ integration, widget }: WidgetsMenuProps) => {
  const { t } = useTranslation(`modules/${integration}`);
  const wrapperColumnCount = useWrapperColumnCount();

  if (!widget || !wrapperColumnCount) return null;
  // Match widget.id with WidgetsDefinitions
  // First get the keys
  const keys = Object.keys(WidgetsDefinitions);
  // Then find the key that matches the widget.type
  const widgetDefinition = keys.find((key) => key === widget.type);
  // Then get the widget definition
  const widgetDefinitionObject =
    WidgetsDefinitions[widgetDefinition as keyof typeof WidgetsDefinitions];

  const handleDeleteClick = () => {
    openContextModalGeneric<WidgetsRemoveModalInnerProps>({
      modal: 'integrationRemove',
      title: <Title order={4}>{t('common:remove')}</Title>,
      innerProps: {
        widgetId: widget.id,
        widgetType: integration,
      },
    });
  };

  const handleChangeSizeClick = () => {
    openContextModalGeneric<WidgetChangePositionModalInnerProps>({
      modal: 'changeIntegrationPositionModal',
      size: 'xl',
      title: null,
      innerProps: {
        widgetId: widget.id,
        widgetType: integration,
        widget,
        wrapperColumnCount,
      },
    });
  };

  const handleEditClick = () => {
    openContextModalGeneric<WidgetEditModalInnerProps>({
      modal: 'integrationOptions',
      title: <Title order={4}>{t('descriptor.settings.title')}</Title>,
      innerProps: {
        widgetId: widget.id,
        widgetType: integration,
        options: widget.properties,
        // Cast as the right type for the correct widget
        widgetOptions: widgetDefinitionObject.options as any,
      },
      zIndex: 5,
    });
  };

  return (
    <GenericTileMenu
      handleClickEdit={handleEditClick}
      handleClickChangePosition={handleChangeSizeClick}
      handleClickDelete={handleDeleteClick}
      displayEdit={
        typeof widget.properties !== 'undefined' &&
        Object.keys(widgetDefinitionObject?.options ?? {}).length !== 0
      }
    />
  );
};
