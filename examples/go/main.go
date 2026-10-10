// Conway's Game of Life as a Bubble Tea app: an Elm-style model/update/view loop, styled with
// Lip Gloss, cross-compiled for 64-bit ARM and running in a browser tab.
package main

import (
	"fmt"
	"math/rand/v2"
	"os"
	"strings"
	"time"

	tea "charm.land/bubbletea/v2"
	"charm.land/lipgloss/v2"
)

var (
	title  = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#0b0d12")).Background(lipgloss.Color("#7ee787")).Padding(0, 1)
	faint  = lipgloss.NewStyle().Foreground(lipgloss.Color("#8b949e"))
	alive  = lipgloss.NewStyle().Foreground(lipgloss.Color("#7ee787"))
	cursor = lipgloss.NewStyle().Background(lipgloss.Color("#d29922"))
	speeds = []time.Duration{400 * time.Millisecond, 200 * time.Millisecond, 120 * time.Millisecond, 60 * time.Millisecond}
)

type tick struct{ id int }

type model struct {
	w, h        int
	cells       [][]bool
	gen         int
	running     bool
	speed       int
	cx, cy      int
	tickID      int
	initialized bool
}

func (m model) Init() tea.Cmd { return nil }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		w, h := max(msg.Width, 10), max(msg.Height-4, 5)
		m.resize(w, h)
		if !m.initialized {
			m.initialized = true
			m.gliderGun()
			m.running = true
			return m, m.schedule()
		}
	case tick:
		if msg.id != m.tickID || !m.running {
			return m, nil
		}
		m.step()
		return m, m.schedule()
	case tea.KeyPressMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		case "space", " ":
			m.running = !m.running
			if m.running {
				return m, m.schedule()
			}
		case "r":
			m.randomize()
		case "c":
			m.clear()
			m.running = false
		case "g":
			m.clear()
			m.gliderGun()
		case "enter":
			m.cells[m.cy][m.cx] = !m.cells[m.cy][m.cx]
		case "up", "k":
			m.cy = (m.cy - 1 + m.h) % m.h
		case "down", "j":
			m.cy = (m.cy + 1) % m.h
		case "left", "h":
			m.cx = (m.cx - 1 + m.w) % m.w
		case "right", "l":
			m.cx = (m.cx + 1) % m.w
		case "+", "=":
			m.speed = min(m.speed+1, len(speeds)-1)
		case "-":
			m.speed = max(m.speed-1, 0)
		}
	}
	return m, nil
}

func (m *model) schedule() tea.Cmd {
	m.tickID++
	id := m.tickID
	return tea.Tick(speeds[m.speed], func(time.Time) tea.Msg { return tick{id} })
}

func (m model) View() tea.View {
	var b strings.Builder
	population := 0
	for _, row := range m.cells {
		for _, c := range row {
			if c {
				population++
			}
		}
	}
	state := "running"
	if !m.running {
		state = "paused"
	}
	// On a narrow screen (a phone), the header and help shorten rather than run off the edge
	width := 0
	if len(m.cells) > 0 {
		width = len(m.cells[0])
	}
	status := fmt.Sprintf("Go + Bubble Tea · generation %d · population %d · %s", m.gen, population, state)
	if width < len("Game of Life ")+len([]rune(status)) {
		status = fmt.Sprintf("gen %d · pop %d · %s", m.gen, population, state)
	}
	fmt.Fprintf(&b, "%s %s\n", title.Render("Game of Life"), faint.Render(status))

	for y, row := range m.cells {
		for x, c := range row {
			cell := " "
			if c {
				cell = alive.Render("●")
			}
			if x == m.cx && y == m.cy && !m.running {
				cell = cursor.Render(map[bool]string{true: "●", false: " "}[c])
			}
			b.WriteString(cell)
		}
		b.WriteByte('\n')
	}
	help := "space pause · arrows + enter draw · r random · g glider gun · c clear · +/- speed · q quit"
	if width < len([]rune(help)) {
		help = "space pause · g gun · r random · q quit"
	}
	b.WriteString(faint.Render(help))

	v := tea.NewView(b.String())
	v.AltScreen = true
	return v
}

func (m *model) resize(w, h int) {
	cells := make([][]bool, h)
	for y := range cells {
		cells[y] = make([]bool, w)
		if y < len(m.cells) {
			copy(cells[y], m.cells[y])
		}
	}
	m.w, m.h, m.cells = w, h, cells
	m.cx, m.cy = min(m.cx, w-1), min(m.cy, h-1)
}

func (m *model) step() {
	next := make([][]bool, m.h)
	for y := range next {
		next[y] = make([]bool, m.w)
		for x := range next[y] {
			n := 0
			for dy := -1; dy <= 1; dy++ {
				for dx := -1; dx <= 1; dx++ {
					if (dx != 0 || dy != 0) && m.cells[(y+dy+m.h)%m.h][(x+dx+m.w)%m.w] {
						n++
					}
				}
			}
			next[y][x] = n == 3 || (n == 2 && m.cells[y][x])
		}
	}
	m.cells = next
	m.gen++
}

func (m *model) randomize() {
	for y := range m.cells {
		for x := range m.cells[y] {
			m.cells[y][x] = rand.IntN(4) == 0
		}
	}
	m.gen = 0
}

func (m *model) clear() {
	for y := range m.cells {
		clear(m.cells[y])
	}
	m.gen = 0
}

// Gosper's glider gun: a pattern that fires gliders forever
func (m *model) gliderGun() {
	gun := []string{
		"........................O...........",
		"......................O.O...........",
		"............OO......OO............OO",
		"...........O...O....OO............OO",
		"OO........O.....O...OO..............",
		"OO........O...O.OO....O.O...........",
		"..........O.....O.......O...........",
		"...........O...O....................",
		"............OO......................",
	}
	for dy, row := range gun {
		for dx, c := range row {
			if c == 'O' && 2+dy < m.h && 2+dx < m.w {
				m.cells[2+dy][2+dx] = true
			}
		}
	}
	m.gen = 0
}

func main() {
	if _, err := tea.NewProgram(model{speed: 2}).Run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
