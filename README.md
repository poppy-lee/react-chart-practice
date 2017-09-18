React-Chart-Practice
============

## Examples

To show examples, clone this repo then run:

```javascript
npm install
npm start
```

Then open [`localhost:8080`](http://localhost:8080) in a browser.

## Usage

```javascript
import React from "react"

import {
	ContinuousChart,
		XAxis, YAxis,
		Area, Line,
		Sensor,
			Focus, Tooltip
} from "./ContinuousChart"

<ContinuousChart
	width={720} height={480} padding="50px 60px 30px"
	colors={[
		"#3baeda", "#8cc054", "#f6bb43", "#f66043", "#8679c5",
		"#bfbfbf", "#235ef6", "#fa40a5", "#04a222", "#615d74",
	]}
>
	<XAxis ticks={10} tickFormat={(x) => `x=${x}`} />
	<YAxis name="percent" tickPostfix="%" />
	<YAxis name="dollars" tickPrefix="$" />
	<Sensor>
		<Focus />
		<Tooltip />
	</Sensor>

	<Line background points={[{x: 0, y: 10}, {x: 5, y: 20}]} />
	<Area line axis="dollars" group="dollars-area" name="dollars1"
		points={[
			{"x":-3,"y":1.4509163888776357},
			{"x":-2,"y":5.540762029941659},
			{"x":-1,"y":3.7468991035397576},
			{"x":0,"y":5.475376560845183},
			{"x":1,"y":3.6099257174683137},
			{"x":2,"y":0.05552778705252015},
			{"x":3,"y":0.6323571446358809}
		]}
	/>
	<Area line axis="dollars" group="dollars-area" name="dollars2"
		points={[
			{"x":-3,"y":0.6894399360997272},
			{"x":-2,"y":1.463265661851913},
			{"x":-1,"y":null},
			{"x":0,"y":3.6096304073701333},
			{"x":1,"y":4.3875338939353155},
			null,
			{"x":3,"y":null}
		]}
	/>
	<Area line axis="dollars" group="dollars-area" name="dollars3"
		points={[
			{"x":-3,"y":null},
			{"x":-2,"y":1.0229734906761419},
			null,
			{"x":0,"y":1.2403322210312497},
			null,
			{"x":2,"y":4.050655196513421},
			{"x":3,"y":5.057203226237544}
		]}
	/>
</ContinuousChart>
```
