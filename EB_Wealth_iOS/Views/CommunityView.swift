import SwiftUI

public struct CommunityView: View {
    @State private var selectedFilter: String = "All"
    @State private var showCreateModal: Bool = false
    @State private var newPostTitle: String = ""
    @State private var newPostCategory: String = "UK Investing"
    @State private var newPostContent: String = ""
    
    let categories = [
        "All", "UK Investing", "ETFs", "Beginners", "Stocks",
        "JISA & Junior Accounts", "Wealth Building", "ISA & Tax Strategy",
        "Portfolio Review", "Dividends & Income", "Questions & Help"
    ]
    
    let availablePostCategories = [
        "UK Investing", "ETFs", "Beginners", "Stocks",
        "JISA & Junior Accounts", "Wealth Building", "ISA & Tax Strategy",
        "Portfolio Review", "Dividends & Income", "Questions & Help"
    ]
    
    @State private var posts: [CommunityPost] = [
        CommunityPost(authorName: "Oliver K.", category: "ISA & Tax Strategy", title: "Maximising your £20k ISA allowance before April 5th", content: "Don't leave your Cash or Stocks & Shares ISA to the last week. Setting up a monthly standing order takes the stress away.", likesCount: 42, commentsCount: 9),
        CommunityPost(authorName: "Sophie M.", category: "ETFs", title: "VWRP vs VUAG: Long term total return comparison", content: "VWRP gives complete peace of mind with global diversity, while VUAG concentrates on US tech giants. Here is why I hold 80/20.", likesCount: 38, commentsCount: 14),
        CommunityPost(authorName: "Marcus P.", category: "Beginners", title: "What I wish I knew before investing my first £1,000 in the UK", content: "Number 1 rule: Never touch money you might need in the next 3 years. Emergency fund in high-yield cash first!", likesCount: 56, commentsCount: 19)
    ]
    
    public init() {}
    
    public var body: some View {
        VStack(spacing: 0) {
            // Category Filter Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(categories, id: \.self) { cat in
                        Button(action: { selectedFilter = cat }) {
                            Text(cat)
                                .font(.system(size: 12, weight: selectedFilter == cat ? .bold : .medium))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(selectedFilter == cat ? Color(hex: "00F0FF") : Color(hex: "00F0FF").opacity(0.12))
                                .foregroundColor(selectedFilter == cat ? Color(hex: "040B14") : Color(hex: "CBD5E1"))
                                .cornerRadius(8)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
            }
            .background(Color(hex: "0A1628").opacity(0.8))
            
            // Posts List
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(posts.filter { selectedFilter == "All" || $0.category == selectedFilter }) { post in
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Circle()
                                    .fill(Color(hex: "00F0FF").opacity(0.2))
                                    .frame(width: 28, height: 28)
                                    .overlay(
                                        Text(String(post.authorName.prefix(1)))
                                            .font(.system(size: 12, weight: .bold))
                                            .foregroundColor(Color(hex: "00F0FF"))
                                    )
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(post.authorName)
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.white)
                                    Text(post.category)
                                        .font(.system(size: 10, weight: .semibold))
                                        .foregroundColor(Color(hex: "FBBF24"))
                                }
                                
                                Spacer()
                            }
                            
                            Text(post.title)
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(.white)
                            
                            Text(post.content)
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "CBD5E1"))
                                .lineLimit(3)
                            
                            HStack(spacing: 16) {
                                Label("\(post.likesCount)", systemImage: "hand.thumbsup.fill")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "00F0FF"))
                                
                                Label("\(post.commentsCount)", systemImage: "bubble.left.fill")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "94A3B8"))
                            }
                        }
                        .padding(16)
                        .background(Color(hex: "0A1628").opacity(0.85))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "00F0FF").opacity(0.2), lineWidth: 1))
                        .cornerRadius(14)
                    }
                }
                .padding(16)
            }
        }
        .overlay(
            Button(action: { showCreateModal = true }) {
                Image(systemName: "square.and.pencil")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(hex: "040B14"))
                    .frame(width: 54, height: 54)
                    .background(Color(hex: "00F0FF"))
                    .clipShape(Circle())
                    .shadow(color: Color(hex: "00F0FF").opacity(0.4), radius: 8, x: 0, y: 4)
            }
            .padding(20),
            alignment: .bottomTrailing
        )
        .sheet(isPresented: $showCreateModal) {
            NavigationView {
                Form {
                    Section(header: Text("Discussion Topic")) {
                        TextField("Enter topic headline", text: $newPostTitle)
                    }
                    
                    Section(header: Text("Category Selection")) {
                        Picker("Select Category", selection: $newPostCategory) {
                            ForEach(availablePostCategories, id: \.self) { cat in
                                Text(cat).tag(cat)
                            }
                        }
                        .pickerStyle(MenuPickerStyle())
                    }
                    
                    Section(header: Text("Insight or Question")) {
                        TextEditor(text: $newPostContent)
                            .frame(height: 120)
                    }
                }
                .navigationTitle("Start Discussion")
                .navigationBarItems(
                    leading: Button("Cancel") { showCreateModal = false },
                    trailing: Button("Publish (+25 XP)") {
                        if !newPostTitle.isEmpty && !newPostContent.isEmpty {
                            posts.insert(CommunityPost(
                                authorName: "Investor",
                                category: newPostCategory,
                                title: newPostTitle,
                                content: newPostContent
                            ), at: 0)
                            newPostTitle = ""
                            newPostContent = ""
                            showCreateModal = false
                        }
                    }.disabled(newPostTitle.isEmpty || newPostContent.isEmpty)
                )
            }
        }
    }
}
