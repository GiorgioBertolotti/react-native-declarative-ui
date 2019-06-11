import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ComposableItem } from '../../models/composableItem';
import { Colors } from '../../styles/colors';
import { globalStyles } from '../../styles/globalStyles';

export interface IOverlayItemListProps {
  pickedItem: ComposableItem | string;
  items: ComposableItem[] | string[];
  displayProperty?: string;
  keyProperty?: string;
  onPick: (item: ComposableItem | string) => void;
  topLabel?: string;
  isObjectMappedToKey?: boolean;
  headerBackgroundColors?: string | string[];
  renderSelectPickerItem?: (item: ComposableItem | string, displayProperty?: string) => React.ReactElement<{}>;
  renderTopLabelItem?: (topLabel: string) => React.ReactElement<{}>;
}

interface IState {
  items: ComposableItem[] | string[];
  isLoading: boolean;
  isFirstLoad: boolean;
}

export default class OverlayItemList extends Component<IOverlayItemListProps, IState> {
  constructor(props: IOverlayItemListProps) {
    super(props);
    this.state = {
      items: props.items,
      isLoading: false,
      isFirstLoad: true
    };
  }

  render() {
    const { isLoading } = this.state;

    return (
      <View style={globalStyles.pickerContainer}>
        {this.renderHeader()}
        {this.renderTopLabel()}
        {isLoading ? (
          <View>Loader</View>
        ) : (
          <FlatList<string | ComposableItem>
            // contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            data={this.state.items}
            //   contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => this.renderItem(item)}
            //   ListEmptyComponent={this.props.emptySetPlaceholder}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.GRAY_200,
                  marginLeft: 16
                }}
              />
            )}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }

  private renderItem = (item: ComposableItem | string) => {
    const { renderSelectPickerItem } = this.props;

    return (
      <TouchableOpacity onPress={() => this.props.onPick(item)}>
        {renderSelectPickerItem
          ? renderSelectPickerItem(item, this.props.displayProperty)
          : this.renderDefaultItem(item)}
      </TouchableOpacity>
    );
  };

  private renderDefaultItem = (item: ComposableItem | string) => {
    return (
      <View style={{ padding: 16 }}>
        {typeof item === 'object' && this.props.displayProperty ? (
          <Text>{String(item[this.props.displayProperty])}</Text>
        ) : (
          <Text>{item}</Text>
        )}
      </View>
    );
  };

  private renderHeader = () => {
    const { headerBackgroundColors } = this.props;

    if (!Array.isArray(headerBackgroundColors)) {
      return (
        <View
          style={[
            styles.listHeaderContainer,
            {
              backgroundColor: headerBackgroundColors || Colors.WHITE
            }
          ]}
        />
      );
    } else {
      return (
        <View style={styles.listHeaderContainer}>
          <LinearGradient
            colors={headerBackgroundColors}
            style={{ position: 'absolute', height: HEADER_HEIGHT, width: '100%' }}
          />
        </View>
      );
    }
  };

  private renderTopLabel = () => {
    const { topLabel, renderTopLabelItem } = this.props;

    if (topLabel) {
      return renderTopLabelItem ? (
        renderTopLabelItem(topLabel)
      ) : (
        <View style={styles.topLabelContainer}>
          <Text style={{ fontSize: 15 }}>{topLabel}</Text>
        </View>
      );
    }

    return null;
  };

  private toggleLoadingIndicator = (show: boolean) => {
    this.setState({
      isLoading: show
    });
  };
}

const HEADER_HEIGHT = 48;
const TOP_LABEL_HEIGHT = 40;

const styles = StyleSheet.create({
  searchBar: {
    alignItems: 'center'
  },
  listHeaderContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16
  },
  buttonContainer: { height: HEADER_HEIGHT, justifyContent: 'center' },
  topLabelContainer: {
    height: TOP_LABEL_HEIGHT,
    backgroundColor: Colors.GRAY_200,
    paddingLeft: 16,
    paddingBottom: 8,
    paddingTop: 14
  }
});
