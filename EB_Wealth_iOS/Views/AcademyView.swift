import SwiftUI

public struct AcademyView: View {
    @Binding public var profile: UserProfile
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var lessonProgress: [String: Bool] = [:]
    @State private var isLoading: Bool = true
    @State private var savingLessonId: String? = nil

    public init(profile: Binding<UserProfile>) {
        self._profile = profile
    }

    private let allLessons: [Lesson] = [
        Lesson(id: "foundations_1",        title: "UK Investing Foundations & Tax Wrappers",              category: "Basics",         durationMinutes: 12, xpReward: 50),
        Lesson(id: "isa_sipp",             title: "Stocks & Shares ISA vs Lifetime ISA vs SIPP",           category: "Tax Efficiency", durationMinutes: 15, xpReward: 75),
        Lesson(id: "etf_mastery",          title: "Understanding ETFs, Index Funds & OCF Fees",            category: "ETFs",           durationMinutes: 18, xpReward: 100),
        Lesson(id: "compound_interest",    title: "The Mathematics of Compound Returns over 20+ Years",    category: "Strategy",       durationMinutes: 10, xpReward: 50),
        Lesson(id: "portfolio_rebalancing",title: "Asset Allocation, Risk Profiles & Rebalancing",         category: "Advanced",       durationMinutes: 20, xpReward: 150),
        Lesson(id: "dividend_investing",   title: "Dividend Investing & Income Strategies in the UK",      category: "Income",         durationMinutes: 16, xpReward: 100),
        Lesson(id: "jisa_junior",          title: "Junior ISAs & Building Wealth for Children",            category: "Family",         durationMinutes: 12, xpReward: 75),
        Lesson(id: "cgt_hmrc",            title: "Capital Gains Tax, HMRC Rules & Annual Exemptions",     category: "Tax Efficiency", durationMinutes: 14, xpReward: 100),
        Lesson(id: "etf_overlap",         title: "ETF Overlap, Duplication Risk & Portfolio Efficiency",  category: "ETFs",           durationMinutes: 10, xpReward: 75),
        Lesson(id: "sipp_pension",        title: "SIPP Deep Dive: Pension Allowances & Tax Relief",       category: "Advanced",       durationMinutes: 22, xpReward: 150),
    ]

    private var lessons: [Lesson] {
        allLessons.map { l in
            var copy = l
            copy.isCompleted = lessonProgress[l.id] == true
            return copy
        }
    }

    private var completedCount: Int { lessons.filter { $0.isCompleted }.count }
    private var totalXP: Int { lessons.filter { $0.isCompleted }.reduce(0) { $0 + $1.xpReward } }

    private let categoryColors: [String: String] = [
        "Basics": "34D399", "Tax Efficiency": "FBBF24", "ETFs": "00F0FF",
        "Strategy": "A78BFA", "Advanced": "F472B6", "Income": "34D399",
        "Family": "38BDF8", "Pension": "F97316"
    ]

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {

                // Header + Progress
                VStack(alignment: .leading, spacing: 10) {
                    Text("EB WEALTH ACADEMY")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text("Structured UK Wealth Curriculum")
                        .font(.system(size: 22, weight: .heavy))
                        .foregroundColor(.white)
                    Text("Master stocks, index funds, dividend strategies, and HMRC tax wrappers.")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))

                    Divider().background(Color(hex: "1E293B"))

                    HStack(spacing: 20) {
                        academyStat(value: "\(completedCount)/\(allLessons.count)", label: "Completed")
                        academyStat(value: "\(totalXP) XP", label: "Earned")
                        academyStat(value: "\(Int((Double(completedCount) / Double(allLessons.count)) * 100))%", label: "Progress")
                    }

                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 4).fill(Color(hex: "FBBF24").opacity(0.15)).frame(height: 6)
                            RoundedRectangle(cornerRadius: 4)
                                .fill(LinearGradient(colors: [Color(hex: "FBBF24"), Color(hex: "F97316")], startPoint: .leading, endPoint: .trailing))
                                .frame(width: geo.size.width * (Double(completedCount) / Double(allLessons.count)), height: 6)
                                .animation(.easeInOut(duration: 0.5), value: completedCount)
                        }
                    }.frame(height: 6)
                }
                .padding(20)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "FBBF24").opacity(0.25), lineWidth: 1))
                .cornerRadius(16)

                if isLoading {
                    HStack(spacing: 10) {
                        ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "00F0FF")))
                        Text("Loading your progress…").font(.system(size: 14)).foregroundColor(Color(hex: "94A3B8"))
                    }.padding()
                } else {
                    // Lesson List
                    VStack(spacing: 12) {
                        ForEach(lessons) { lesson in
                            lessonRow(lesson)
                        }
                    }
                }
            }
            .padding(16)
        }
        .onAppear(perform: loadProgress)
    }

    private func lessonRow(_ lesson: Lesson) -> some View {
        let color = categoryColors[lesson.category] ?? "00F0FF"
        let isSaving = savingLessonId == lesson.id

        return HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(lesson.isCompleted ? Color(hex: "34D399").opacity(0.15) : Color(hex: "00F0FF").opacity(0.1))
                    .frame(width: 44, height: 44)
                if isSaving {
                    ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "00F0FF")))
                } else {
                    Image(systemName: lesson.isCompleted ? "checkmark.circle.fill" : "play.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(lesson.isCompleted ? Color(hex: "34D399") : Color(hex: "00F0FF"))
                }
            }

            VStack(alignment: .leading, spacing: 3) {
                Text(lesson.title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(lesson.isCompleted ? Color(hex: "64748B") : .white)
                    .strikethrough(lesson.isCompleted, color: Color(hex: "475569"))
                HStack(spacing: 8) {
                    Text(lesson.category)
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(Color(hex: color))
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(Color(hex: color).opacity(0.12))
                        .cornerRadius(4)
                    Text("\(lesson.durationMinutes) min")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "94A3B8"))
                    Text("+\(lesson.xpReward) XP")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(hex: "FBBF24"))
                }
            }

            Spacer()

            if !lesson.isCompleted {
                Button(action: { markComplete(lesson) }) {
                    Text("Start")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "040B14"))
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(Color(hex: "00F0FF"))
                        .cornerRadius(6)
                }
                .disabled(isSaving)
            }
        }
        .padding(16)
        .background(Color(hex: "0A1628").opacity(lesson.isCompleted ? 0.5 : 0.75))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(
            lesson.isCompleted ? Color(hex: "1E293B") : Color(hex: "00F0FF").opacity(0.15), lineWidth: 1))
        .cornerRadius(14)
        .animation(.easeInOut(duration: 0.2), value: lesson.isCompleted)
    }

    private func academyStat(value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(value).font(.system(size: 16, weight: .black)).foregroundColor(.white)
            Text(label).font(.system(size: 10)).foregroundColor(Color(hex: "94A3B8"))
        }
    }

    private func loadProgress() {
        isLoading = true
        firebaseService.fetchLessonProgress { progress in
            lessonProgress = progress
            isLoading = false
        }
    }

    private func markComplete(_ lesson: Lesson) {
        savingLessonId = lesson.id
        firebaseService.writeLessonProgress(lessonId: lesson.id, completed: true, xpReward: lesson.xpReward) { ok in
            savingLessonId = nil
            if ok {
                lessonProgress[lesson.id] = true
                profile.xp += lesson.xpReward
                // Sync updated XP to Firestore
                firebaseService.syncProfile(profile) { _ in }
            }
        }
    }
}
