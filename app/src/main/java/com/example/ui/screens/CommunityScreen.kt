package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CommunityComment
import com.example.data.model.CommunityPostEntity
import com.example.ui.theme.*

@Composable
fun CommunityScreen(
    posts: List<CommunityPostEntity>,
    selectedPostIdForComments: Int? = null,
    postComments: List<CommunityComment> = emptyList(),
    onOpenComments: (Int) -> Unit = {},
    onCloseComments: () -> Unit = {},
    onAddComment: (postId: Int, text: String) -> Unit = { _, _ -> },
    onCreatePost: (category: String, title: String, content: String) -> Unit,
    onLikePost: (Int) -> Unit,
    onToggleSave: (Int) -> Unit,
    onDeletePost: (Int) -> Unit,
    isAdmin: Boolean = false,
    onBack: () -> Unit
) {
    var selectedCategory by remember { mutableStateOf("All") }
    var showCreateDialog by remember { mutableStateOf(false) }

    val categories = listOf("All", "UK Investing", "ETFs", "Beginners", "Stocks", "JISA", "Wealth Building", "Questions")

    val filteredPosts = if (selectedCategory == "All") {
        posts
    } else {
        posts.filter { it.category == selectedCategory }
    }

    Scaffold(
        containerColor = Color.Transparent,
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCreateDialog = true },
                containerColor = Color(0xFF00F0FF),
                contentColor = Color(0xFF040B14),
                modifier = Modifier.testTag("create_community_post_fab")
            ) {
                Icon(Icons.Default.Edit, contentDescription = "New Discussion")
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Transparent)
                .padding(innerPadding)
        ) {
            // Top App Bar
            Surface(
                color = Color(0xD90A1628),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = onBack) {
                            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "EB Wealth Community",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    ScrollableTabRow(
                        selectedTabIndex = categories.indexOf(selectedCategory).coerceAtLeast(0),
                        containerColor = Color.Transparent,
                        edgePadding = 0.dp,
                        indicator = {}
                    ) {
                        categories.forEach { cat ->
                            val isSel = selectedCategory == cat
                            Tab(
                                selected = isSel,
                                onClick = { selectedCategory = cat },
                                modifier = Modifier
                                    .padding(end = 6.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) Color(0xFF00F0FF) else Color(0x2200F0FF))
                                    .padding(horizontal = 12.dp, vertical = 6.dp),
                                text = {
                                    Text(
                                        text = cat,
                                        fontSize = 12.sp,
                                        fontWeight = if (isSel) FontWeight.Bold else FontWeight.Normal,
                                        color = if (isSel) Color(0xFF040B14) else Color(0xFFCBD5E1)
                                    )
                                }
                            )
                        }
                    }
                }
            }

            // Posts List
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(top = 16.dp, bottom = 96.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredPosts) { post ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onOpenComments(post.id) },
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                        border = BorderStroke(1.dp, Color(0x2800F0FF))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(28.dp)
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(Color(0x3300F0FF)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = post.authorName.take(1),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp,
                                            color = Color(0xFF00F0FF)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column {
                                        Text(post.authorName, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color.White)
                                        Text("${post.authorLevel} • ${post.createdAtFormatted}", fontSize = 10.sp, color = Color(0xFF94A3B8))
                                    }
                                }

                                Surface(
                                    color = Color(0x22FFFFFF),
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        text = post.category,
                                        fontSize = 10.sp,
                                        color = Color(0xFFCBD5E1),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            Text(
                                text = post.title,
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = Color.White
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = post.content,
                                fontSize = 13.sp,
                                lineHeight = 19.sp,
                                color = Color(0xFFCBD5E1)
                            )

                            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = Color(0x1FFFFFFF))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    IconButton(
                                        onClick = { onLikePost(post.id) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            if (post.isLiked) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                            contentDescription = "Like",
                                            tint = if (post.isLiked) Color(0xFFEF4444) else Color(0xFF94A3B8),
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                    Text("${post.likesCount}", fontSize = 12.sp, color = Color(0xFF94A3B8))

                                    Spacer(modifier = Modifier.width(16.dp))

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.clickable { onOpenComments(post.id) }
                                    ) {
                                        Icon(
                                            Icons.Default.ChatBubbleOutline,
                                            contentDescription = "Comments",
                                            tint = Color(0xFF00F0FF),
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("${post.commentsCount + (if (selectedPostIdForComments == post.id) postComments.size else 0)} replies", fontSize = 12.sp, color = Color(0xFF00F0FF), fontWeight = FontWeight.SemiBold)
                                    }
                                }

                                Row {
                                    IconButton(
                                        onClick = { onToggleSave(post.id) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            if (post.isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
                                            contentDescription = "Save",
                                            tint = if (post.isSaved) GoldAccent else TextMuted,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }

                                    if (isAdmin) {
                                        IconButton(
                                            onClick = { onDeletePost(post.id) },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(
                                                Icons.Default.DeleteOutline,
                                                contentDescription = "Moderate",
                                                tint = Color(0xFFEF4444),
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Comments Sheet / Dialog
    if (selectedPostIdForComments != null) {
        val targetPost = posts.find { it.id == selectedPostIdForComments }
        CommentsDialog(
            post = targetPost,
            comments = postComments,
            onDismiss = onCloseComments,
            onAddComment = { text ->
                onAddComment(selectedPostIdForComments, text)
            }
        )
    }

    if (showCreateDialog) {
        val allCategories = listOf(
            "UK Investing",
            "ETFs",
            "Beginners",
            "Stocks",
            "JISA & Junior Accounts",
            "Wealth Building",
            "ISA & Tax Strategy",
            "Portfolio Review",
            "Dividends & Income",
            "Questions & Help"
        )
        CreatePostDialog(
            availableCategories = allCategories,
            onDismiss = { showCreateDialog = false },
            onConfirm = { cat, title, content ->
                onCreatePost(cat, title, content)
                showCreateDialog = false
            }
        )
    }
}

@Composable
private fun CommentsDialog(
    post: CommunityPostEntity?,
    comments: List<CommunityComment>,
    onDismiss: () -> Unit,
    onAddComment: (String) -> Unit
) {
    var replyText by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        shape = RoundedCornerShape(16.dp),
        containerColor = Color(0xD90A1628),
        title = {
            Column {
                Text("Discussion Thread", fontWeight = FontWeight.Bold, fontSize = 17.sp, color = Color.White)
                if (post != null) {
                    Text(post.title, fontSize = 12.sp, color = Color(0xFF00F0FF), maxLines = 1)
                }
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 380.dp)
            ) {
                LazyColumn(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (comments.isEmpty()) {
                        item {
                            Text(
                                text = "No comments yet. Be the first to share an insight!",
                                fontSize = 12.sp,
                                color = Color(0xFF94A3B8),
                                modifier = Modifier.padding(vertical = 12.dp)
                            )
                        }
                    } else {
                        items(comments) { comment ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0x22FFFFFF),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(comment.authorName, fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color.White)
                                        Text(comment.timeFormatted, fontSize = 10.sp, color = Color(0xFF94A3B8))
                                    }
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(comment.content, fontSize = 12.sp, color = Color(0xFFCBD5E1), lineHeight = 16.sp)
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = replyText,
                        onValueChange = { replyText = it },
                        placeholder = { Text("Write a reply...", fontSize = 12.sp, color = Color(0xFF64748B)) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFF00F0FF),
                            unfocusedBorderColor = Color(0x3300F0FF)
                        ),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f),
                        singleLine = true
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Button(
                        onClick = {
                            val t = replyText
                            replyText = ""
                            onAddComment(t)
                        },
                        enabled = replyText.isNotBlank(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Send", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF040B14))
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", fontWeight = FontWeight.Bold, color = Color(0xFF00F0FF))
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun CreatePostDialog(
    availableCategories: List<String>,
    onDismiss: () -> Unit,
    onConfirm: (category: String, title: String, content: String) -> Unit
) {
    var category by remember { mutableStateOf(availableCategories.firstOrNull() ?: "UK Investing") }
    var expanded by remember { mutableStateOf(false) }
    var title by remember { mutableStateOf("") }
    var content by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        shape = RoundedCornerShape(16.dp),
        containerColor = Color(0xD90A1628),
        title = {
            Text("Start Discussion", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color.White)
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Topic Title
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Topic Title", color = Color(0xFF94A3B8)) },
                    placeholder = { Text("e.g. Which S&P 500 ETF has lowest OCF?", color = Color(0xFF64748B), fontSize = 12.sp) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    ),
                    singleLine = true
                )

                // Category Dropdown
                ExposedDropdownMenuBox(
                    expanded = expanded,
                    onExpandedChange = { expanded = !expanded },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = category,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Category", color = Color(0xFF94A3B8)) },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded)
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = Color(0xFF00F0FF),
                            unfocusedBorderColor = Color(0x3300F0FF),
                            focusedTrailingIconColor = Color(0xFF00F0FF),
                            unfocusedTrailingIconColor = Color(0xFF94A3B8)
                        ),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor()
                    )

                    ExposedDropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false },
                        modifier = Modifier.background(Color(0xFF0A1628))
                    ) {
                        availableCategories.forEach { catOption ->
                            DropdownMenuItem(
                                text = {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = catOption,
                                            color = if (catOption == category) Color(0xFF00F0FF) else Color.White,
                                            fontWeight = if (catOption == category) FontWeight.Bold else FontWeight.Normal
                                        )
                                        if (catOption == category) {
                                            Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF00F0FF), modifier = Modifier.size(16.dp))
                                        }
                                    }
                                },
                                onClick = {
                                    category = catOption
                                    expanded = false
                                },
                                modifier = Modifier.background(
                                    if (catOption == category) Color(0x2200F0FF) else Color.Transparent
                                )
                            )
                        }
                    }
                }

                // Content
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    label = { Text("Share your question or insight...", color = Color(0xFF94A3B8)) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    shape = RoundedCornerShape(10.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Color(0xFF00F0FF),
                        unfocusedBorderColor = Color(0x3300F0FF)
                    ),
                    maxLines = 5
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank() && content.isNotBlank()) {
                        onConfirm(category, title, content)
                    }
                },
                enabled = title.isNotBlank() && content.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00F0FF)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("Post (+25 XP)", color = Color(0xFF040B14), fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = Color(0xFF94A3B8))
            }
        }
    )
}
