import SwiftUI

public struct AcademyView: View {
    @Binding public var profile: UserProfile
    public var onSelectLesson: (Int) -> Void
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var selectedLevel: Int = 1

    public init(profile: Binding<UserProfile>, onSelectLesson: @escaping (Int) -> Void = { _ in }) {
        self._profile = profile
        self.onSelectLesson = onSelectLesson
    }

    private let lessons = [
        (id: 1, title: "What is Investing?", time: "2 min", xp: 50, completed: true),
        (id: 2, title: "Saving vs Investing", time: "3 min", xp: 50, completed: false),
        (id: 3, title: "The Magic of Compound Growth", time: "3 min", xp: 50, completed: false),
        (id: 4, title: "Stocks, Bonds & Cash Explained", time: "4 min", xp: 50, completed: false),
        (id: 5, title: "Index Funds & ETFs: The Ultimate Vehicle", time: "4 min", xp: 50, completed: false),
        (id: 6, title: "Understanding Market Volatility", time: "5 min", xp: 50, completed: false)
    ]

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                // Header Badge & Title (Screenshot 5)
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 6) {
                        Image(systemName: "graduationcap.fill")
                            .foregroundColor(Color(hex: "FBBF24"))
                            .font(.system(size: 14))
                        Text("EB WEALTH ACADEMY")
                            .font(.system(size: 11, weight: .black))
                            .foregroundColor(Color(hex: "FBBF24"))
                            .tracking(0.6)
                    }

                    Text("Structured Investor Curriculum")
                        .font(.system(size: 20, weight: .black))
                        .foregroundColor(.white)

                    Text("6 progressive levels designed to build disciplined long-term compounding wealth.")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))
                        .lineSpacing(3)
                }

                // Level Selector Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        levelPill(level: 1, title: "Level 1 Investing Foundations")
                        levelPill(level: 2, title: "Level 2 Investment Strategies")
                        levelPill(level: 3, title: "Level 3 UK Tax Wrappers & ISA")
                    }
                }

                // Sub-heading
                VStack(alignment: .leading, spacing: 2) {
                    Text("LEVEL \(selectedLevel) — INVESTING FOUNDATIONS")
                        .font(.system(size: 13, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                        .tracking(0.5)

                    Text("Master the mental models, time horizons, and mathematical laws behind wealth creation.")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
                .padding(.top, 4)

                // Lesson items list matching Screenshot 5
                VStack(spacing: 10) {
                    ForEach(lessons, id: \.id) { lesson in
                        Button(action: { onSelectLesson(lesson.id) }) {
                            HStack(spacing: 14) {
                                ZStack {
                                    Circle()
                                        .stroke(lesson.completed ? Color(hex: "10B981") : Color(hex: "00F0FF"), lineWidth: 1.5)
                                        .background(Circle().fill(lesson.completed ? Color(hex: "10B981").opacity(0.15) : Color.clear))
                                        .frame(width: 38, height: 38)

                                    if lesson.completed {
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(Color(hex: "10B981"))
                                    } else {
                                        Text("\(lesson.id)")
                                            .font(.system(size: 14, weight: .black))
                                            .foregroundColor(Color(hex: "00F0FF"))
                                    }
                                }

                                VStack(alignment: .leading, spacing: 3) {
                                    Text(lesson.title)
                                        .font(.system(size: 14, weight: .black))
                                        .foregroundColor(.white)
                                    HStack(spacing: 8) {
                                        Text("⏱ \(lesson.time)")
                                            .font(.system(size: 11))
                                            .foregroundColor(Color(hex: "94A3B8"))
                                        Text("+\(lesson.xp) XP")
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(Color(hex: "FBBF24"))
                                    }
                                }

                                Spacer()

                                Image(systemName: "chevron.right")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(Color(hex: "64748B"))
                            }
                            .padding(14)
                            .background(Color(hex: "071322").opacity(0.8))
                            .cornerRadius(14)
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "00F0FF").opacity(0.22), lineWidth: 1))
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func levelPill(level: Int, title: String) -> some View {
        let isSelected = selectedLevel == level
        return Button(action: { selectedLevel = level }) {
            Text(title)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(isSelected ? Color(hex: "040B14") : Color(hex: "94A3B8"))
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color(hex: "00F0FF") : Color(hex: "071322").opacity(0.8))
                .cornerRadius(20)
                .overlay(RoundedRectangle(cornerRadius: 20).stroke(Color(hex: "00F0FF").opacity(isSelected ? 0 : 0.2), lineWidth: 1))
                .shadow(color: isSelected ? Color(hex: "00F0FF").opacity(0.4) : Color.clear, radius: 6)
        }
    }
}
