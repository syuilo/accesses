limit = 1024

follow = true
rec = true

logs = (JSON.parse local-storage.get-item \log) || []

window.onscroll = ->
	$window = $ window
	height = $window.height!
	scroll-top = $window.scroll-top!
	document-height = $ document .height!

	follow := height + scroll-top >= (document-height - 64px)

	if follow
		$ \#follow .add-class \enable
	else
		$ \#follow .remove-class \enable

window.onload = ->
	$ '#logs > tbody' .css \padding-top ($ '#logs > thead' .outer-height!) + \px

$ ->
	socket = io.connect!

	socket.on \info (data) ->
		$ \machine .text data.machine
		$ \pid .text data.pid
		$ \uptime .text data.uptime

	socket.on \log (data) ->
		if rec
			add-log data
			if logs.length > limit
				logs.shift!
			logs.push data
			local-storage.set-item \log JSON.stringify logs

	$ \#export .click ->
		$ @ .attr \href 'data:application/octet-stream,' + encodeURIComponent JSON.stringify logs

	$ \#clear .click ->
		logs := []
		local-storage.set-item \log JSON.stringify logs
		$ '#logs > tbody' .empty!

	$ \#follow .click ->
		follow := !follow

		if follow
			$ \#follow .add-class \enable
			$ 'html, body' .animate do
				scroll-top: ($ \html .outer-height!) - $ window .height!
				100ms
				\swing
		else
			$ \#follow .remove-class \enable

	$ \#rec .click ->
		rec := !rec

		if rec
			$ \#rec .add-class \enable
			$ '#rec > i' .attr \class 'fa fa-pause'
		else
			$ \#rec .remove-class \enable
			$ '#rec > i' .attr \class 'fa fa-play'

	Sortable.create ($ 'body > header > left > info').0, do
		group: \info
		animation: 150ms
		chosen-class: \chosen
		store:
			get: (sortable) ->
				order = local-storage.get-item sortable.options.group.name
				if order then order.split \| else []
			set: (sortable) ->
				order = sortable.to-array!
				local-storage.set-item sortable.options.group.name, order.join \|

	init-fix-thead!
	logs.for-each add-log
	update-clock!
	set-interval update-clock, 1000ms

function add-log(data)
	date = data.date
	method = data.method
	host = data.host
	path = data.path
	query = data.query
	ua = data.headers['user-agent']
	ip = data.ip
	color = data.color
	worker = data.worker

	method-color = switch method
		| \GET => \#007acc
		| \POST => \#ff6a00
		| _ => \#fff

	$table = $ \#logs
	$body = $table.children \tbody
	$head = $table.children \thead

	$tr = $ "<tr tabindex=0>
		<td data-column='date' title='#{date}'>#{date}</td>
		<td data-column='method' title='#{method}' style='color:#{method-color};'>#{method}</td>
		<td data-column='host' title='#{host}'>#{host}</td>
		<td data-column='path' title='#{path}#{if query? then '?' + query else ''}'>#{path}#{if query? then '<query>?' + query + '</query>' else ''}</td>
		<td data-column='ua' title='#{ua}'>#{ua}</td>
		<td data-column='ip' title='#{ip}'><ip style='background:#{color.bg};color:#{color.fg} !important;'>#{ip}</ip></td>
		<td data-column='worker' title='#{worker}'>(#{worker})</td>
	</tr>"

	columns = []
	$head.children \tr .children \th .each ->
		columns.push ($ @ .attr \data-column)

	sort-column columns, $tr

	$tr.append-to $body

	if ($body.children \tr .length) > limit
		($body.children \tr)[0].remove!

	if follow
		scroll-bottom!

function scroll-bottom
	scroll 0, ($ \html .outer-height!)

function sort-column(columns, $tr)
	for i from 0 to columns.length + 1
		$tr.children "td[data-column='#{columns[i]}']" .append-to $tr

function init-fix-thead
	$head = $ '#logs > thead'
	Sortable.create ($head.children \tr).0, do
		group: \columns
		animation: 150ms
		chosen-class: \chosen
		store:
			get: (sortable) ->
				order = local-storage.get-item sortable.options.group.name
				if order then order.split \| else []
			set: (sortable) ->
				order = sortable.to-array!
				local-storage.set-item sortable.options.group.name, order.join \|
		on-start: ->
			$head.add-class \dragging
		on-end: ->
			$head.remove-class \dragging
		on-update: ->
			$ths = $head.children \tr .children \th
			columns = []
			$ths.each ->
				columns.push ($ @ .attr \data-column)
			$ \#logs .children \tbody .children \tr .each ->
				sort-column columns, $ @

function update-clock
	s = (new Date!).get-seconds!
	m = (new Date!).get-minutes!
	h = (new Date!).get-hours!

	yyyymmdd = moment!.format 'YYYY/MM/DD'
	hhmmss = moment!.format 'HH:mm:ss'

	if s % 2 == 0
		hhmmss .= replace /:/g ':'
	else
		hhmmss .= replace /:/g ' '

	$clock = $ '#now'
	$clock.children \.yyyymmdd .text yyyymmdd
	$clock.children \.hhmmss .text hhmmss
