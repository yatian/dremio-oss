/*
 * Copyright (C) 2017 Dremio Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, PropTypes } from 'react';
import {Link} from 'react-router';
import Radium from 'radium';
import classNames from 'classnames';
import Immutable from 'immutable';

import FontIcon from 'components/Icon/FontIcon';
import HeaderButtonsMixin from 'dyn-load/pages/HomePage/components/HeaderButtonsMixin';

@Radium
@HeaderButtonsMixin
export class HeaderButtons extends Component {
  static contextTypes = {
    location: PropTypes.object.isRequired
  };

  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    toggleVisibility: PropTypes.func.isRequired,
    rootEntityType: PropTypes.string,
    user: PropTypes.string,
    rightTreeVisible: PropTypes.bool
  };

  static defaultProps = {
    entity: Immutable.Map()
  };

  getSourceButtons() {
    const { entity } = this.props;
    const buttons = [];

    if (entity.get('isPhysicalDataset')) {
      buttons.push({
        qa: 'query-folder',
        iconType: 'Query',
        to: entity.getIn(['links', 'query']),
        isAdd: false
      });
    } else if (entity.get('fileSystemFolder')) {
      buttons.push({
        qa: 'convert-folder',
        iconType: 'FolderConvert',
        style: styles.largeButton,
        to: {...this.context.location, state: {
          modal: 'DatasetSettingsModal',
          tab: 'format',
          entityType: entity.get('entityType'),
          entityId: entity.get('id'),
          query: {then: 'query'}
        }},
        isAdd: false
      });
    }

    return buttons;
  }

  renderButton(item, index) {
    return <Link
      className='button-white'
      data-qa={`${item.qa}-button`}
      to={item.to ? item.to : '.'}
      key={`${item.iconType}-${index}`}
      style={{...styles.button, ...item.style}}>
      {item.isAdd && <FontIcon type='AddSimple' theme={styles.addIcon} />}
      <FontIcon type={item.iconType} />
    </Link>;
  }

  render() {
    const { location } = this.context;
    const { rootEntityType } = this.props;

    const headerButtonsHash = {
      space: [
        ...this.getSpaceSettingsButtons()
        /*,
        {
          qa: 'add-dataset',
          iconType: 'VirtualDataset',
          to: {...location, state: {modal: 'AddDatasetModal'}},
          isAdd: true
        }   */
      ],
      source: [
        ...this.getSourceSettingsButtons(),
        ...this.getSourceButtons()
      ],
      home: [
        {
          qa: 'add-folder',
          iconType: 'Folder',
          to: {...location, state: {modal: 'AddFolderModal'}},
          isAdd: true
        },
        // TODO disabled for beta 1
        // {
        //   qa: 'add-dataset',
        //   iconType: 'VirtualDataset',
        //   to: {...location, state: {modal: 'AddDatasetModal'}},
        //   isAdd: true
        // },
        {
          qa: 'add-file',
          iconType: 'File',
          to: {...location, state: {modal: 'AddFileModal'}},
          isAdd: true
        }
      ]
    };
    const buttonsForCurrentPage = headerButtonsHash[rootEntityType] || [];
    const { rightTreeVisible } = this.props;
    const buttonsClass = classNames('settings-button', {'active': rightTreeVisible});
    const activityButton = (
      <button
        className={buttonsClass}
        onClick={this.props.toggleVisibility}
        style={[{display: rightTreeVisible ? 'none' : 'block'}, styles.activityBth]}>
        <FontIcon type='Expand' />
      </button>
    );
    return (
      <span className='main-settings-holder' style={styles.mainSettingsHolder}>
        {buttonsForCurrentPage.map(this.renderButton)}
        {false && activityButton /* disabled until this is useful */}
      </span>
    );
  }
}

const styles = {
  addIcon: {
    'Icon': {
      width: 12,
      margin: 0,
      backgroundPosition: '-7px 50%'
    }
  },
  mainSettingsHolder: {
    display: 'flex'
  },
  button: {
    background: '#dbe8ed',
    borderRadius: '2px',
    marginRight: '6px',
    height: 25,
    width: 40,
    boxShadow: '0 1px 1px #b2bec7',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center'
  },
  largeButton: {
    width: 54,
    paddingTop: 1
  },
  activityBth: {
    ':hover': {
      opacity: '.7'
    }
  }
};
