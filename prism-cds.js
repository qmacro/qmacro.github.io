export default function({ Prism }) {
	Prism.languages.cds = {
		'single-line-comment': {
			'pattern': /\/\/.*/,
			'alias': 'comment'
		},
		'block-comment': {
			'pattern': /\/\*[\s\S]*?\*\//m,
			'alias': 'comment'
		},
		'keyword': {
			'pattern': /(?<!\.|\$)\b(abstract|action|actions|annotation|aspect|context|define|entity|enum|event|extend|function|namespace|service|view)\b(?!\$|\s*:)/,
		},
		'cdl-keyword': {
			'pattern': /(?<!\.|\$)\b(array of|column|columns|current|day|default|depends|else|enabled|end|generated|hana|hour|identity|import|index|language|layout|leading|masked|merge|minute|minutes|mode|month|name|new|no|off|only|others|parameters|partition|partitions|priority|projection|projection on|queue|range|ratio|reset|returns|right|row|search|second|start|storage|store|table|technical|then|trailing|trim|unique|unload|value|values|virtual|when|with parameters|year)\b(?!\$|\s*:)/,
			'alias': 'keyword'
		},
		'type': {
			'pattern': /(?<!\.|\$)\b(Binary|Boolean|DateTime|Date|DecimalFloat|Decimal|Double|Int(16|32|64)|Integer64|Integer|LargeBinary|LargeString|Number|String|Timestamp|Time|UInt8|UUID)\b\s*(\([^()]*\))?(?!\$|\s*:)/,
			'alias': 'builtin'
		},
		'association-composition': {
			'alias': 'keyword',
			'pattern': /(?<!\.|\$)\b(Association\b\s*(?:\[[0-9.eE+, *-]*\]\s*)?to\b\s*(?:many\s*|one\s*)?|Composition\b\s*(?:\[[0-9.eE+, *-]*\]\s*)?of\b\s*(?:many\s*|one\s*)?)(?:(?=\s*{)|([$_a-zA-Z][$_a-zA-Z0-9]*|\"[^\"]*(?:\"\"[^\"]*)*\"|!\[[^\]]*(?:\]\][^\]]*)*\]))/
		},
		'cqlkeywords': {
			'alias': 'keyword',
			'pattern': /(?<!\.|\$)\b(as|key|on|type)\b(?!\$|\s*:)/
		},
		'using': {
			'alias': 'keyword',
			'pattern': /(?<!\.)\b(using)(?!\s*:)\b/
		},
		'from': {
			'alias': 'keyword',
			'pattern': /\b(from)\b/
		},
		'annotation': {
			'alias': 'important',
			'pattern': /(?<!')@\S+/
		}

	}
}
