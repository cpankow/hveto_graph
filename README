hveto_graph.js is an interative way to view triggers that are vetoed by the hveto algorithm (link). Given a round summary file (named hveto.json) in the same directory as the webpage (see index.html), the JS script attempts to put together a an interactive webpage using D3.js (http://d3js.org/).

Some preprocessing of the hveto result needs to be done first (see utils/ directory):
	* Run the txt -> tsv converter on each of the trigger files
	* Run the round summary JSON constructor on the round summary ASCII file

Features:
  * Clickable round winner dots on the scatter plot
		* displays time/frequency/SNR information
		* If available, will attempt to generate an OmegaScan (link) for the time period around the trigger in both the winning and reference channel

todo:
	* highlight loudest triggers
	* highlight triggers vetoed by clicked winner channel
	* make summary table pretty (link with cis)
	* Move style to appropriate CSS
	* Add base OmegaScan directory link (if available)
	* Find a way to embed trigger information directly into JSON (long term, could be troublesome)

Document TODOs:
	* document txt -> tsv conversion
	* document summary -> json conversion
