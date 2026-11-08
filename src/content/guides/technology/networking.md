---
title: "Networking: The Complete Guide"
description: IP addressing, subnets, HTTP, DNS, and the conventions that let networked systems find each other.
updated: 2026-10-30
heroImage: /og-default.png
heroImageAlt: Editorial illustration for the ORIZ.IN Networking guide.
keyQuestions:
  - question: What does /24 mean?
    answer: "It is a prefix length: the first 24 bits identify the network. The remaining bits identify hosts. A /24 IPv4 network has 256 addresses, with network and broadcast reserved."
  - question: Why use CIDR?
    answer: CIDR allows variable prefix lengths and route aggregation. It replaced fixed class-based allocation and makes address planning more efficient.
startHere: &a1
  - ipv4-subnetting-guide
faq:
  - question: What is a private IP address?
    answer: An address in a reserved range such as 10.0.0.0/8, 172.16.0.0/12 or 192.168.0.0/16. It is not routed on the public internet.
  - question: Why can two devices have the same private IP?
    answer: Private ranges are reused in separate networks. NAT translates them at the boundary, but overlapping networks can still cause routing confusion.
tools:
  - subnet-calculator
featuredArticles: *a1
---


IP addressing, subnets, HTTP, DNS, and the conventions that let networked systems find each other.

Addressing and routing explain a large share of problems that look like application bugs.

## How to read this category

Start with **IPv4 Subnetting Without Tears**. The articles are ordered as a sequence, but each one stands alone if you arrived with a specific question.

## What this guide covers

The category currently contains 1 article across 1 series. The complete article index appears below this guide, followed by any tools that support the same work.

## How to use it

Read the guide first for the map, then use the article index to go deeper. Where a calculator is available, run your own numbers rather than accepting an illustrative result. Where a rule or rate is involved, verify the current version before acting.
