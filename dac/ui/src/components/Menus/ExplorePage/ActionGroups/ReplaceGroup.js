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
import Radium from 'radium';
import pureRender from 'pure-render-decorator';

import { TEXT } from 'constants/DataTypes';
import { REPLACEABLE_TYPES } from 'constants/columnTypeGroups';

import ColumnMenuItem from './../ColumnMenus/ColumnMenuItem';

@Radium
@pureRender
export default class ReplaceGroup extends Component {
  static propTypes = {
    makeTransform: PropTypes.func.isRequired,
    columnType: PropTypes.string
  }

  static renderMenuItems(columnType, onClick) {
    return [
      <ColumnMenuItem
        columnType={columnType}
        actionType='EXTRACT_TEXT'
        title={la('Extract Text...')}
        availableTypes={[TEXT]}
        onClick={onClick}
      />,
      <ColumnMenuItem
        columnType={columnType}
        actionType='REPLACE_TEXT'
        title={la('Replace Text...')}
        availableTypes={[TEXT]}
        onClick={onClick}
      />,
      <ColumnMenuItem
        columnType={columnType}
        actionType='REPLACE'
        title={la('Replace...')}
        availableTypes={REPLACEABLE_TYPES}
        onClick={onClick}
      />,
      <ColumnMenuItem
        columnType={columnType}
        actionType='SPLIT'
        title={la('Split...')}
        availableTypes={[TEXT]}
        onClick={onClick}
      />
    ];
  }

  render() {
    const { columnType, makeTransform } = this.props;
    const menuItems = ReplaceGroup.renderMenuItems(columnType, makeTransform);
    return (
      <div>
        {menuItems}
      </div>
    );
  }
}
