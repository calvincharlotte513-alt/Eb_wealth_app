import SwiftUI

public struct LessonDetailView: View {
    public let lessonId: Int
    public var onBack: () -> Void
    @State private var selectedQuizOption: Int? = nil
    @State private var showQuizFeedback: Bool = false

    public init(lessonId: Int, onBack: @escaping () -> Void = {}) {
        self.lessonId = lessonId
        self.onBack = onBack
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Header Row
                HStack(spacing: 12) {
                    Button(action: onBack) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                            .frame(width: 36, height: 36)
                            .background(Color(hex: "00F0FF").opacity(0.1))
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("What is Investing?")
                            .font(.system(size: 16, weight: .heavy))
                            .foregroundColor(.white)
                        Text("Level 1 Foundation • ⏱ 2 min • +50 XP")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }

                // Lesson Content Card
                VStack(alignment: .leading, spacing: 10) {
                    Text("CORE PRINCIPLES")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "00F0FF"))
                    Text("Investing purchases fractional ownership in productive businesses, technology infrastructure, and real global assets that generate revenue and compound wealth above the rate of inflation.")
                        .font(.system(size: 13))
                        .foregroundColor(.white)
                        .lineSpacing(4)

                    Divider().background(Color.white.opacity(0.08)).padding(.vertical, 4)

                    Text("THE INFLATION TAX")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text("Holding cash in low-yield savings guarantees a silent loss of purchasing power over decades. Disciplined indexation via UK tax shelters protects and compounds capital permanently.")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "CBD5E1"))
                        .lineSpacing(4)
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))

                // Quiz Card
                VStack(alignment: .leading, spacing: 12) {
                    Text("KNOWLEDGE CHECK QUIZ")
                        .font(.system(size: 11, weight: .black))
                        .foregroundColor(Color(hex: "FBBF24"))

                    Text("What is the primary objective of investing versus cash savings?")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)

                    quizButton(index: 0, text: "Compounding returns that beat inflation")
                    quizButton(index: 1, text: "Guaranteeing zero price fluctuation")
                    quizButton(index: 2, text: "Avoiding all UK taxes automatically")
                }
                .padding(18)
                .background(Color(hex: "071322").opacity(0.85))
                .cornerRadius(18)
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "FBBF24").opacity(0.3), lineWidth: 1))
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
    }

    private func quizButton(index: Int, text: String) -> some View {
        Button(action: {
            selectedQuizOption = index
            showQuizFeedback = true
        }) {
            HStack {
                Text(text)
                    .font(.system(size: 12))
                    .foregroundColor(.white)
                Spacer()
                if selectedQuizOption == index {
                    Image(systemName: index == 0 ? "checkmark.circle.fill" : "xmark.circle.fill")
                        .foregroundColor(index == 0 ? Color(hex: "10B981") : Color(hex: "F43F5E"))
                }
            }
            .padding(12)
            .background(Color.white.opacity(0.05))
            .cornerRadius(10)
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
        }
    }
}
