package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "eb_events")
data class EBEventEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val dateString: String,
    val timeString: String,
    val description: String,
    val priceString: String,
    val spacesRemaining: Int,
    val host: String = "EB Wealth Senior Educators",
    val isRegistered: Boolean = false,
    val format: String = "Live Interactive Masterclass (Zoom)"
)
