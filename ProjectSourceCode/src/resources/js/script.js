document.addEventListener('DOMContentLoaded', () => {
	const statsRoot = document.getElementById('stats-root');
	if (!statsRoot) {
		return;
	}

	const authUserId = statsRoot.dataset.authUserId;
	const userIdInput = document.getElementById('stats-user-id');
	const loadBtn = document.getElementById('load-stats-btn');
	const feedback = document.getElementById('stats-feedback');
	const grid = document.getElementById('stats-grid');
	const tableBody = document.getElementById('stats-table-body');

	if (authUserId) {
		userIdInput.value = authUserId;
	}

	function currency(value) {
		if (value === null || value === undefined) {
			return '--';
		}
		return `$${Number(value).toFixed(2)}`;
	}

	function renderTotals(totals) {
		grid.innerHTML = '';

		const cards = [
			{ label: 'Total Net Profit', value: currency(totals.totalNetProfit) },
			{ label: 'Total Hours', value: Number(totals.totalHours).toFixed(2) },
			{ label: 'Total Hands', value: totals.totalHandsPlayed },
			{ label: 'Overall $/hr', value: currency(totals.overallDollarsPerHour) }
		];

		for (const card of cards) {
			const el = document.createElement('article');
			el.className = 'metric-card';
			el.innerHTML = `<p class="metric-label">${card.label}</p><p class="metric-value">${card.value}</p>`;
			grid.appendChild(el);
		}
	}

	function renderSessions(sessions) {
		tableBody.innerHTML = '';

		if (!sessions.length) {
			tableBody.innerHTML =
				'<tr><td colspan="7">No sessions found for this user/date range.</td></tr>';
			return;
		}

		for (const session of sessions) {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${session.sessionId}</td>
				<td>${currency(session.buyIn)}</td>
				<td>${currency(session.cashOut)}</td>
				<td>${session.handsPlayed}</td>
				<td>${Number(session.timePlayedHours).toFixed(2)}</td>
				<td>${currency(session.netProfit)}</td>
				<td>${currency(session.dollarsPerHour)}</td>
			`;
			tableBody.appendChild(row);
		}
	}

	async function loadSummary() {
		const userId = userIdInput.value.trim();
		if (!userId) {
			feedback.textContent = 'Please enter a user ID first.';
			return;
		}

		feedback.textContent = 'Loading statistics...';
		try {
			const response = await fetch(`/api/sessions/summary?userId=${encodeURIComponent(userId)}`);
			if (!response.ok) {
				const errorBody = await response.json();
				throw new Error(errorBody.error || 'Failed to fetch summary');
			}

			const payload = await response.json();
			renderTotals(payload.totals);
			renderSessions(payload.sessions);
			feedback.textContent = `Loaded ${payload.sessions.length} session(s) for user ${payload.userId}.`;
		} catch (err) {
			feedback.textContent = `Could not load statistics: ${err.message}`;
			grid.innerHTML = '';
			tableBody.innerHTML = '';
		}
	}

	loadBtn.addEventListener('click', loadSummary);
	if (authUserId) {
		loadSummary();
	}
});
