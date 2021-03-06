/*
 * Copyright (c) 2002-2019 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Action type constants
export const NAME = 'app'
export const APP_START = `${NAME}/APP_START`
export const USER_CLEAR = `${NAME}/USER_CLEAR`

export const URL_ARGUMENTS_CHANGE = `${NAME}/URL_ARGUMENTS_CHANGE`

// State constants
export const DESKTOP = 'DESKTOP'
export const WEB = 'WEB'
export const CLOUD = 'CLOUD'

// Selectors
export const getHostedUrl = state => (state[NAME] || {}).hostedUrl || null
export const getEnv = state => (state[NAME] || {}).env || WEB
export const inWebEnv = state => getEnv(state) === WEB

// Reducer
export default function reducer (state = { hostedUrl: null }, action) {
  switch (action.type) {
    case APP_START:
      return { ...state, hostedUrl: action.url, env: action.env }
    default:
      return state
  }
}
