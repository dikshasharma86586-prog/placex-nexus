package edu.placex.placement.controller;

import edu.placex.placement.dto.CompanyRequest;
import edu.placex.placement.model.Company;
import edu.placex.placement.service.CompanyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyService companies;
    public CompanyController(CompanyService companies) { this.companies = companies; }

    @GetMapping
    public List<Company> findAll(@RequestParam(required = false) String q,
                                 @RequestParam(required = false) String industry,
                                 @RequestParam(required = false) String status) {
        return companies.findAll().stream()
                .filter(company -> contains(q, company.name(), company.industry(), company.role()))
                .filter(company -> blank(industry) || company.industry().equalsIgnoreCase(industry))
                .filter(company -> blank(status) || company.status().equalsIgnoreCase(status))
                .toList();
    }

    @GetMapping("/{id}") public Company findById(@PathVariable String id) { return companies.findById(id); }
    @PostMapping public ResponseEntity<Company> create(@Valid @RequestBody CompanyRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(companies.create(request)); }
    @PutMapping("/{id}") public Company update(@PathVariable String id, @Valid @RequestBody CompanyRequest request) { return companies.update(id, request); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable String id) { companies.delete(id); return ResponseEntity.noContent().build(); }

    private static boolean blank(String value) { return value == null || value.isBlank(); }
    private static boolean contains(String query, String... values) { return blank(query) || java.util.Arrays.stream(values).anyMatch(value -> value.toLowerCase().contains(query.trim().toLowerCase())); }
}
